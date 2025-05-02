import { useCoverStore } from "@/stores/cover";
import { forwardRef, useMemo } from "react";
import { Group } from "three";

interface CoverPageProps {}

export const CoverPage = forwardRef<Group, CoverPageProps>((_, ref) => {
  const coverWidth = useCoverStore((state) => state.width);
  const coverHeight = useCoverStore((state) => state.height);
  const coverThickness = useCoverStore((state) => state.thickness);
  const coverGuardWidth = useCoverStore((state) => state.guardWidth);
  const coverSpineWidth = useCoverStore((state) => state.spineWidth);
  const coverInsideColor = useCoverStore((state) => state.insideColor);

  const realWidth = useMemo(() => {
    return (
      coverWidth / 2 -
      coverGuardWidth -
      coverSpineWidth / 2 -
      coverThickness / 2
    );
  }, [coverWidth, coverGuardWidth, coverSpineWidth, coverThickness]);

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
          color={coverInsideColor}
          roughness={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
});
