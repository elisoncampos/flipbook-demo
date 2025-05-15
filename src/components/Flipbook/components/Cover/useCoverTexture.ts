import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { CanvasTexture, Texture } from "three";

interface CoverSection {
  name: string;
  texture: Texture;
  width: number;
  height: number;
}

interface UseCoverTexturesProps {
  coverFront: string | null;
  coverBack: string | null;
  coverWidth: number;
  coverGuardWidth: number;
  coverSpineWidth: number;
  height: number;
}

const waitForImageLoad = (img: HTMLImageElement): Promise<void> =>
  new Promise((resolve) => {
    if (img.complete) resolve();
    else img.onload = () => resolve();
  });

const mergeImages = async (
  height: number,
  frontImg?: HTMLImageElement,
  backImg?: HTMLImageElement
): Promise<HTMLImageElement | null> => {
  if (!frontImg && !backImg) return null;

  if (frontImg && !backImg) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = frontImg.src;
      img.onload = () => resolve(img);
    });
  }
  if (!frontImg && backImg) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = backImg.src;
      img.onload = () => resolve(img);
    });
  }

  await Promise.all([
    frontImg && waitForImageLoad(frontImg),
    backImg && waitForImageLoad(backImg),
  ]);

  const frontWidth = frontImg?.width || 0;
  const backWidth = backImg?.width || 0;
  const totalWidth = frontWidth + backWidth;

  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  if (backImg) {
    const x = frontImg ? 0 : (totalWidth - backWidth) / 2;
    ctx.drawImage(backImg, x, 0, backWidth, height);
  }

  if (frontImg) {
    const x = backImg ? backWidth : (totalWidth - frontWidth) / 2;
    ctx.drawImage(frontImg, x, 0, frontWidth, height);
  }

  const combinedImage = new Image();
  combinedImage.src = canvas.toDataURL("image/png");
  await waitForImageLoad(combinedImage);

  return combinedImage;
};

export function useCoverTextures({
  coverFront,
  coverBack,
  coverWidth,
  coverGuardWidth,
  coverSpineWidth,
  height,
}: UseCoverTexturesProps): CoverSection[] {
  const frontTexture = useTexture(coverFront ?? "");
  const backTexture = useTexture(coverBack ?? "");

  return useMemo(() => {
    let imageToSplit: HTMLImageElement | null = null;

    const isFrontValid = frontTexture?.image instanceof HTMLImageElement;
    const isBackValid = backTexture?.image instanceof HTMLImageElement;

    if (isFrontValid && !coverBack) {
      imageToSplit = frontTexture.image;
    } else if (isBackValid && !coverFront) {
      imageToSplit = backTexture.image;
    } else if (isFrontValid && isBackValid) {
      imageToSplit = document.createElement("img");
      mergeImages(height, frontTexture.image, backTexture.image).then(
        (merged) => {
          if (merged) imageToSplit!.src = merged.src;
        }
      );
    }

    if (!imageToSplit) return [];
    console.log("imageToSplit", imageToSplit);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const slices = [
      { name: "guardLeft", width: coverGuardWidth },
      { name: "coverLeft", width: coverWidth },
      { name: "spine", width: coverSpineWidth },
      { name: "coverRight", width: coverWidth },
      { name: "guardRight", width: coverGuardWidth },
    ];

    let offsetX = 0;
    const results: CoverSection[] = [];

    for (const { name, width } of slices) {
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(
        imageToSplit,
        offsetX,
        0,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const newTexture = new CanvasTexture(canvas);
      newTexture.needsUpdate = true;
      results.push({ name, texture: newTexture, width, height });
      offsetX += width;
    }

    return results;
  }, [
    coverFront,
    coverBack,
    frontTexture,
    backTexture,
    coverWidth,
    coverGuardWidth,
    coverSpineWidth,
    height,
  ]);
}
