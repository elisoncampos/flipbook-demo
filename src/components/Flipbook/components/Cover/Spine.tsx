import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Group, Object3D, Vector2, Vector3 } from "three";
import { CoverPage } from "./CoverPage";
import { useCoverStore } from "../../stores/cover";
import { SpineObject, SpineProps } from "../../types";
import { useFlipperStore } from "../../stores/flipper";

export const Spine = forwardRef<SpineObject, SpineProps>(
  (
    {
      frontAnchor,
      backAnchor,
      spineTexture,
      frontGuardTexture,
      backGuardTexture,
    },
    ref
  ) => {
    const frontGuardRef = useRef<Group>(null);
    const backGuardRef = useRef<Group>(null);
    const spineRef = useRef<Group>(null);

    const coverGuardWidth = useCoverStore((state) => state.guardWidth);
    const coverSpineWidth = useCoverStore((state) => state.spineWidth);
    const coverThickness = useCoverStore((state) => state.thickness);
    const coverHeight = useCoverStore((state) => state.totalHeight);

    const currentPage = useFlipperStore((state) => state.currentPage);
    const totalPages = useFlipperStore((state) => state.totalPages);

    const isClosed = useMemo(() => {
      return currentPage < 1 || currentPage >= totalPages + 1;
    }, [currentPage, totalPages]);

    const anchors = useMemo(() => {
      return {
        frontGuard: new Object3D(),
        backGuard: new Object3D(),
      };
    }, []);

    const positionGuard = useCallback(
      (guardObj: Group, fixedAnchor: Vector3, targetAnchor: Vector3) => {
        guardObj.parent?.worldToLocal(fixedAnchor);
        guardObj.parent?.worldToLocal(targetAnchor);

        const angle = -Math.atan2(
          fixedAnchor.z - targetAnchor.z,
          fixedAnchor.x - targetAnchor.x
        );

        guardObj.rotation.y = angle;
      },
      []
    );

    const positionDorse = useCallback(() => {
      const spine = spineRef.current;
      const frontGuard = frontGuardRef.current;
      const backGuard = backGuardRef.current;

      if (!spine || !frontGuard || !backGuard) {
        console.error("Um ou mais elementos da capa não estão prontos.");
        return;
      }

      // Força a atualização da posição global
      spine.updateMatrixWorld(true);

      const frontAnchorPos = frontAnchor.getWorldPosition(new Vector3());
      const backAnchorPos = backAnchor.getWorldPosition(new Vector3());

      // Ponto médio entre front e back (para centralizar o dorso)

      const middle = new Vector3(
        (frontAnchorPos.x + backAnchorPos.x) / 2,
        (frontAnchorPos.y + backAnchorPos.y) / 2,
        (frontAnchorPos.z + backAnchorPos.z) / 2
      );

      // Ângulo entre os pivots (linha ligando back → front).
      const angle = -Math.atan2(
        frontAnchorPos.z - backAnchorPos.z,
        frontAnchorPos.x - backAnchorPos.x
      );

      const distance = new Vector2(
        frontAnchorPos.x,
        frontAnchorPos.z
      ).distanceTo(new Vector2(backAnchorPos.x, backAnchorPos.z));

      let guardOffset = coverGuardWidth;
      if (distance !== coverSpineWidth) {
        const diffHalf = Math.abs(coverSpineWidth - distance) / 2;
        guardOffset = Math.sqrt(
          Math.abs(Math.pow(coverGuardWidth, 2) - Math.pow(diffHalf, 2))
        );
      }
      const totalOffset = guardOffset - coverThickness / 2;

      const heightOffset = isClosed ? 0 : coverThickness;

      const spinePos = new Vector3(
        middle.x +
          Math.sin(angle) * totalOffset +
          Math.sin(angle) * heightOffset,
        middle.y,
        middle.z +
          Math.cos(angle) * totalOffset +
          Math.cos(angle) * heightOffset
      );

      spine.parent?.worldToLocal(spinePos);
      spinePos.y = spine.position.y;
      spine.rotation.y = angle;
      spine.position.copy(spinePos);
      spine.updateMatrixWorld(true);

      const frontGuardAnchorPos = anchors.frontGuard.getWorldPosition(
        new Vector3()
      );

      const backGuardAnchorPos = anchors.backGuard.getWorldPosition(
        new Vector3()
      );

      positionGuard(frontGuard, frontAnchorPos, frontGuardAnchorPos);
      positionGuard(backGuard, backGuardAnchorPos, backAnchorPos);
    }, [
      frontAnchor,
      backAnchor,
      coverGuardWidth,
      coverSpineWidth,
      coverThickness,
      isClosed,
      anchors.frontGuard,
      anchors.backGuard,
      positionGuard,
    ]);

    useEffect(() => {
      if (
        !spineRef.current ||
        !frontGuardRef.current ||
        !backGuardRef.current
      ) {
        throw new Error("Some references are not ready");
      }

      spineRef.current.add(anchors.frontGuard);
      anchors.frontGuard.position.x = coverSpineWidth / 2 + coverThickness / 2;

      spineRef.current.add(anchors.backGuard);
      anchors.backGuard.position.x = -coverSpineWidth / 2 - coverThickness / 2;

      anchors.frontGuard.add(frontGuardRef.current);
      frontGuardRef.current.position.z = coverThickness / 2;

      frontGuardRef.current.rotation.y = Math.PI / 2;

      anchors.backGuard.add(backGuardRef.current);
      backGuardRef.current.position.z = coverThickness / 2;
      backGuardRef.current.rotation.y = -Math.PI / 2;
    }, [
      anchors.backGuard,
      anchors.frontGuard,
      coverSpineWidth,
      coverThickness,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        positionDorse,
      }),
      [positionDorse]
    );

    return useMemo(
      () => (
        <>
          <group ref={frontGuardRef}>
            <CoverPage
              size={new Vector2(coverGuardWidth, coverHeight)}
              position={[coverGuardWidth / 2, 0, 0]}
              thickness={coverThickness}
              visible={true}
              texture={frontGuardTexture}
            />
          </group>

          <group ref={backGuardRef}>
            <CoverPage
              size={new Vector2(coverGuardWidth, coverHeight)}
              position={[-coverGuardWidth / 2, 0, 0]}
              thickness={coverThickness}
              visible={true}
              texture={backGuardTexture}
            />
          </group>

          <CoverPage
            ref={spineRef}
            size={new Vector2(coverSpineWidth, coverHeight)}
            thickness={coverThickness}
            visible={true}
            texture={spineTexture}
          />
        </>
      ),
      [
        backGuardTexture,
        coverGuardWidth,
        coverHeight,
        coverSpineWidth,
        coverThickness,
        frontGuardTexture,
        spineTexture,
      ]
    );
  }
);
