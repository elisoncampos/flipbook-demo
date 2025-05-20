import { useCoverStore } from "../../stores/cover";
import { TableProps } from "../../types";
import { forwardRef, useMemo } from "react";
import { Group, FrontSide } from "three";
import { useControls } from "leva";

const tableTextures = {
  glass: {
    roughness: 0.05,
    metalness: 0.1,
    opacity: 0.85,
    transparent: true,
  },
  wood: {
    roughness: 0.8,
    metalness: 0.1,
    opacity: 1,
    transparent: false,
  },
  metal: {
    roughness: 0.2,
    metalness: 0.8,
    opacity: 1,
    transparent: false,
  },
  marble: {
    roughness: 0.4,
    metalness: 0.2,
    opacity: 1,
    transparent: false,
  },
};

export const Table = forwardRef<Group, TableProps>(
  ({ topHeight = 0.05, footerRadius = 0.5, footerHeight = 10 }, ref) => {
    const totalWidth = useCoverStore((state) => state.totalWidth);

    const {
      shape,
      rotation,
      color,
      transparency,
      texture,
      width,
      depth
    } = useControls("Table", {
      shape: {
        options: ["round", "square", "rectangular"],
        value: "round",
      },
      rotation: {
        value: 0,
        min: 0,
        max: 360,
        step: 1,
      },
      color: {
        value: "#1e2a3d",
      },
      transparency: {
        value: 0.85,
        min: 0,
        max: 1,
        step: 0.01,
      },
      texture: {
        options: Object.keys(tableTextures),
        value: "glass",
      },
      width: {
        value: totalWidth * 1.5,
        min: totalWidth,
        max: totalWidth * 3,
        step: 0.1,
      },
      depth: {
        value: totalWidth * 1.5,
        min: totalWidth,
        max: totalWidth * 3,
        step: 0.1,
        render: (get) => get("Table.shape") === "rectangular",
      },
    });

    const tableGeometry = useMemo(() => {
      switch (shape) {
        case "round":
          return <cylinderGeometry args={[width/2, width/2, topHeight, 48]} />;
        case "square":
          return <boxGeometry args={[width, topHeight, width]} />;
        case "rectangular":
          return <boxGeometry args={[width, topHeight, depth]} />;
      }
    }, [shape, width, depth, topHeight]);

    const materialProps = {
      ...tableTextures[texture as keyof typeof tableTextures],
      color,
      opacity: transparency,
    };

    return (
      <group ref={ref} position={[0, -topHeight, 0]} rotation={[0, rotation * Math.PI/180, 0]}>
        <mesh position={[0, topHeight / 2, 0]} castShadow receiveShadow>
          {tableGeometry}
          <meshStandardMaterial
            {...materialProps}
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
