import { useCoverStore } from "../../stores/cover";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, Object3D, SRGBColorSpace, Texture, Vector2 } from "three";
import { CoverPage } from "./CoverPage";
import { Spine } from "./Spine";
import { useFrame } from "@react-three/fiber";
import { CoverObject, SpineObject } from "../../types";
import { mergeImages, waitForImageLoad } from "../../utils/mergeImages";
import { unitToPixel } from "../../utils/math";

interface Slice {
  width: number;
  texture: Texture | null;
  order: number;
}

type Slices = Record<string, Slice>;

const loadImage = (src: string | null): Promise<HTMLImageElement | null> =>
  new Promise((resolve, reject) => {
    
    const img = new Image();
    if (!src) {
      return resolve(null);
    }
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const createTextureFromCanvas = async (
  source: HTMLImageElement,
  sx: number,
  sw: number,
  height: number
): Promise<Texture> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = sw;
  canvas.height = height;

  ctx.clearRect(0, 0, sw, height);
  ctx.drawImage(source, sx, 0, sw, height, 0, 0, sw, height);

  const img = new Image();
  img.src = canvas.toDataURL("image/png");
  await waitForImageLoad(img);

  const texture = new Texture(img);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const buildSlices = (
  realWidth: number,
  guardWidth: number,
  spineWidth: number
): Slices => ({
  front: { width: realWidth, texture: null, order: 4 },
  frontGuard: { width: guardWidth, texture: null, order: 3 },
  spine: { width: spineWidth, texture: null, order: 2 },
  backGuard: { width: guardWidth, texture: null, order: 1 },
  back: { width: realWidth, texture: null, order: 0 },
});

const useCoverTextureSlices = () => {
  const [slices, setSlices] = useState<Slices | null>(null);

  const frontUrl = useCoverStore((s) => s.front);
  const backUrl = useCoverStore((s) => s.back);
  const coverHeight = useCoverStore((s) => s.totalHeight);
  const coverTotalWidth = useCoverStore((s) => s.totalWidth);
  const guardWidth = useCoverStore((s) => s.guardWidth);
  const spineWidth = useCoverStore((s) => s.spineWidth);
  const realWidth = useCoverStore((s) => s.coverWidth);

  useEffect(() => {
    const loadTextures = async () => {
      const [frontImg, backImg] = await Promise.all([
        loadImage(frontUrl!),
        loadImage(backUrl!),
      ]);

      const merged = await mergeImages({
        totalHeight: unitToPixel(coverHeight),
        totalWidth: unitToPixel(coverTotalWidth),
        frontImg,
        backImg,
      });

      if (!merged) return;

      const real = unitToPixel(realWidth);
      const guard = unitToPixel(guardWidth);
      const spine = unitToPixel(spineWidth);
      const height = unitToPixel(coverHeight);

      const totalSliceWidth = real * 2 + guard * 2 + spine;

      const scalingFactor = merged.width / totalSliceWidth;

      const realAdj = real * scalingFactor;
      const guardAdj = guard * scalingFactor;
      const spineAdj = spine * scalingFactor;

      const baseSlices = buildSlices(realAdj, guardAdj, spineAdj);

      const sortedKeys = Object.keys(baseSlices).sort(
        (a, b) => baseSlices[a].order - baseSlices[b].order
      );

      let offsetX = 0;
      const texturePromises = [];
      for (const key of sortedKeys) {
        const slice = baseSlices[key];
        texturePromises.push(
          (async () => {
            const texture = await createTextureFromCanvas(
              merged,
              offsetX,
              slice.width * scalingFactor,
              height
            );
            return { key, texture };
          })()
        );
        offsetX += slice.width;
      }

      const results = await Promise.allSettled(texturePromises);
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          const { key, texture } = r.value;
          baseSlices[key].texture = texture;
        }
      });

      setSlices(baseSlices);
    };

    loadTextures();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return slices;
};

export const Cover = forwardRef<CoverObject>((_, ref) => {
  const mounted = useRef(false);

  const frontRef = useRef<Group>(null);
  const backRef = useRef<Group>(null);
  const spineRef = useRef<SpineObject>(null);

  const anchors = useMemo(
    () => ({
      front: new Object3D(),
      back: new Object3D(),
    }),
    []
  );

  const coverGuardWidth = useCoverStore((state) => state.guardWidth);
  const coverRealWidth = useCoverStore((state) => state.coverWidth);
  const coverThickness = useCoverStore((state) => state.thickness);
  const coverHeight = useCoverStore((state) => state.totalHeight);

  useImperativeHandle(
    ref,
    () => {
      if (!frontRef.current || !backRef.current || !spineRef.current) {
        throw new Error("references is not initialized.");
      }

      const offset = coverRealWidth / 2 + coverGuardWidth - coverThickness;

      return Object.assign(frontRef.current, {
        appendFrontTo(group: Group, xOffset: number = 0) {
          const front = frontRef.current!;
          group.add(front);
          front.rotation.y = -Math.PI / 2;
          front.position.z = offset;
          front.position.x = -coverThickness / 2 - xOffset;
        },
        appendBackTo(group: Group, xOffset: number = 0) {
          const back = backRef.current!;
          group.add(back);
          back.rotation.y = Math.PI / 2;
          back.position.z = offset;
          back.position.x = coverThickness / 2 + xOffset;
        },
      });
    },
    [coverGuardWidth, coverRealWidth, coverThickness]
  );

  useEffect(() => {
    const front = frontRef.current;
    const back = backRef.current;

    if (!front || !back) {
      console.error("Um ou mais elementos da capa não estão prontos.", {
        front,
        back,
      });
      throw new Error("Capa não está pronta");
    }

    const frontAnchor = anchors["front"];
    front.add(frontAnchor);
    const pivotOffset = coverRealWidth / 2;
    frontAnchor.position.x = -pivotOffset;

    const backAnchor = anchors["back"];
    back.add(backAnchor);
    backAnchor.position.x = pivotOffset;

    mounted.current = true;
  }, [anchors, coverRealWidth]);

  useFrame(() => {
    if (!mounted.current) return;
    spineRef.current?.positionDorse();
  });

  const slices = useCoverTextureSlices();

  return (
    <>
      <CoverPage
        ref={frontRef}
        size={new Vector2(coverRealWidth, coverHeight)}
        thickness={coverThickness}
        texture={slices?.front.texture}
      />
      <CoverPage
        ref={backRef}
        size={new Vector2(coverRealWidth, coverHeight)}
        thickness={coverThickness}
        texture={slices?.back.texture}
      />
      <Spine
        ref={spineRef}
        frontAnchor={anchors.front}
        backAnchor={anchors.back}
        frontGuardTexture={slices?.frontGuard.texture}
        backGuardTexture={slices?.backGuard.texture}
        spineTexture={slices?.spine.texture}
      />
    </>
  );
});
