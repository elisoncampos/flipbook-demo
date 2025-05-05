import { forwardRef, useMemo } from "react";
import { Group } from "three";
import { usePageTextures, usePaperTexture } from "@/hooks/book/useBookTextures";
import { PageDefinition } from "@/types";
import { usePageStore } from "@/stores/page";

interface PageProps {
  data: PageDefinition;
  onClick: (e: React.MouseEvent) => void;
}

export const Page = forwardRef<Group, PageProps>(({ data, onClick }, ref) => {
  const width = usePageStore((state) => state.width);
  const height = usePageStore((state) => state.height);

  const paperTexture = usePaperTexture();

  const { frontTexture, backTexture } = usePageTextures(
    data.front,
    data.back,
    data.color
  );

  const materials = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => (
        <meshStandardMaterial
          key={i}
          attach={`material-${i}`}
          map={paperTexture}
          color="#f5f2e9"
        />
      )),
    [paperTexture]
  );

  return (
    <group ref={ref} onClick={onClick}>
      <mesh
        position={[0, 0, width / 2]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, data.thickness]} />
        {materials}
        {frontTexture && (
          <meshStandardMaterial attach="material-4" map={frontTexture} />
        )}
        {backTexture && (
          <meshStandardMaterial attach="material-5" map={backTexture} />
        )}

        {/* frente */}
        {/* <meshStandardMaterial attach="material-4" color={data.color ?? "red"} /> */}
        {/* verso */}
        {/* <meshStandardMaterial
          attach="material-5"
          color={data.color ?? "blue"}
        /> */}
      </mesh>
    </group>
  );
});
