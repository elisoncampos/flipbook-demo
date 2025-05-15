import { useMemo } from "react";
import { MeshStandardMaterial, Texture } from "three";

interface UseSharedMaterialsProps {
  baseMaterials: MeshStandardMaterial[];
  textures: {
    texture: Texture | null | undefined;
    index: number;
  }[];
}

export const useSharedMaterials = ({
  baseMaterials,
  textures,
}: UseSharedMaterialsProps) => {
  const materials = useMemo(() => {
    const clonedMaterials = baseMaterials.map((mat) => mat.clone());

    textures.forEach(({ texture, index }) => {
      if (texture) {
        const texturedMat = clonedMaterials[index];
        texturedMat.color.set("white");
        texturedMat.map = texture;
        texturedMat.needsUpdate = true;
      }
    });

    return clonedMaterials;
  }, [baseMaterials, textures]);

  return materials;
};
