import { useCoverStore } from "../../stores/cover";
import { TableProps } from "../../types";
import { forwardRef } from "react";
import { Group, FrontSide } from "three";

export const Table = forwardRef<Group, TableProps>(
  ({ topHeight = 0.05, footerRadius = 0.5, footerHeight = 10 }, ref) => {
    const totalWidth = useCoverStore((state) => state.totalWidth);
    const topRadius = totalWidth * 0.75;

    return (
      <group ref={ref} position={[0, -topHeight, 0]}>
        <mesh position={[0, topHeight / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[topRadius, topRadius, topHeight, 48]} />
          <meshStandardMaterial
            color={0x1e2a3d}
            transparent={true}
            opacity={0.85}
            roughness={0.05}
            metalness={0.1}
            side={FrontSide}
          />
        </mesh>

        <mesh position={[0, -footerHeight / 2 - topHeight / 2, 0]}>
          <cylinderGeometry
            args={[footerRadius / 2, footerRadius / 2, footerHeight, 16]}
          />
          <meshStandardMaterial
            color={0x777777}
            roughness={0.3}
            metalness={0.6}
            side={FrontSide}
          />
        </mesh>
      </group>
    );
  }
);
