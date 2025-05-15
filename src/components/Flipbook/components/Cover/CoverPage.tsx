import { useSharedMaterials } from "../../hooks/utils/useSharedMaterials";
import { CoverPartProps } from "../../types";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Group, MeshStandardMaterial } from "three";

const sharedMaterials = Array.from(
  { length: 6 },
  () => new MeshStandardMaterial({ color: "gray" })
);

export const CoverPage = forwardRef<Group, CoverPartProps>(
  ({ size, thickness, position, visible = true, texture }, ref) => {
    const groupRef = useRef<Group>(null);

    useImperativeHandle(ref, () => groupRef.current as Group, []);

    const materials = useSharedMaterials({
      baseMaterials: sharedMaterials,
      textures: [{ texture: texture, index: 4 }],
    });

    return (
      <group ref={groupRef} position={position}>
        <mesh material={materials} visible={visible}>
          <boxGeometry args={[size.x, size.y, thickness]} />
        </mesh>
      </group>
    );
  }
);

CoverPage.displayName = "CoverPage";
