import { CoverPartProps } from "../../types";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { Group, MeshStandardMaterial } from "three";

export const CoverPage = forwardRef<Group, CoverPartProps>(
  ({ size, thickness, position, visible = true, texture }, ref) => {
    const groupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => groupRef.current as Group, []);

    const materials = useMemo(() => {
      if (!texture) return undefined;

      return Array.from({ length: 6 }, (_, i) => {
        const isInvertedFace = i === 5;

        // preciso clonar a textura para não afetar as outras faces
        const map = isInvertedFace ? texture.clone() : texture;
        const material = new MeshStandardMaterial({ map });
        material.name = `material-${i}`;

        if (isInvertedFace && map) {
          map.repeat.x = -1;
          map.offset.x = 1;
          map.needsUpdate = true;
        }

        return material;
      });
    }, [texture]);

    return (
      <group ref={groupRef} position={position}>
        <mesh visible={visible} material={materials}>
          <boxGeometry args={[size.x, size.y, thickness]} />
        </mesh>
      </group>
    );
  }
);

CoverPage.displayName = "CoverPage";
