import { useCoverStore } from "@/stores/cover";
import { forwardRef, useMemo } from "react";
import { Group } from "three";

interface CoverPageProps {}

export const CoverPage = forwardRef<Group, CoverPageProps>((_, ref) => {
  const totalWidth = useCoverStore((state) => state.totalWidth);
  const coverHeight = useCoverStore((state) => state.totalHeight);
  const coverThickness = useCoverStore((state) => state.thickness);
  const coverGuardWidth = useCoverStore((state) => state.guardWidth);
  const coverSpineWidth = useCoverStore((state) => state.spineWidth);
  const coverOutsideColor = useCoverStore((state) => state.outsideColor);

  const realWidth = useMemo(() => {
    return (
      totalWidth / 2 -
      coverGuardWidth -
      coverSpineWidth / 2 -
      coverThickness / 2
    );
  }, [totalWidth, coverGuardWidth, coverSpineWidth, coverThickness]);

  return (
    <group ref={ref}>
      <mesh
        position={[0, 0, realWidth / 2 + coverGuardWidth]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <boxGeometry args={[realWidth, coverHeight, coverThickness]} />
        <meshStandardMaterial
          attach="material"
          // TODO: usar textura em imagem depois da demo
          color={coverOutsideColor}
          roughness={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
});
