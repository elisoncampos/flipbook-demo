import { useMemo } from "react";
import { MeshStandardMaterial, Texture, CanvasTexture } from "three";
import { useTexture } from "@react-three/drei";
import { useCoverStore } from "../../stores/cover";

export function useCoverMaterials(): MeshStandardMaterial[] {
  const frontUrl = useCoverStore((state) => state.front);
  const backUrl = useCoverStore((state) => state.back);
  const insideColor = useCoverStore((state) => state.insideColor);

  const frontImage = useTexture(frontUrl ?? "");
  const backImage = useTexture(backUrl ?? "");

  const front = useMemo(() => {
    let combinedTexture: Texture | undefined;

    if (frontImage?.image && backImage?.image) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Failed to get 2D context for canvas.");
      }

      const frontWidth = frontImage.image.width;
      const frontHeight = frontImage.image.height;
      const backWidth = backImage.image.width;
      const backHeight = backImage.image.height;

      const width = frontWidth + backWidth;
      const height = Math.max(frontHeight, backHeight);

      canvas.width = width;
      canvas.height = height;

      const frontImageHeight = (frontHeight / frontWidth) * (canvas.width / 2);
      const backImageHeight = (backHeight / backWidth) * (canvas.width / 2);

      const frontImageY = (height - frontImageHeight) / 2;
      const backImageY = (height - backImageHeight) / 2;

      context.drawImage(
        frontImage.image,
        0,
        frontImageY,
        canvas.width / 2,
        frontImageHeight
      );
      context.drawImage(
        backImage.image,
        canvas.width / 2,
        backImageY,
        canvas.width / 2,
        backImageHeight
      );

      combinedTexture = new CanvasTexture(canvas);
    }

    const textureToUse = combinedTexture || frontImage || backImage;

    return new MeshStandardMaterial({
      map: textureToUse ?? undefined,
      roughness: 0.1,
    });
  }, [frontImage, backImage]);

  const back = useMemo(() => {
    return new MeshStandardMaterial({
      color: insideColor,
      roughness: 0.1,
    });
  }, [insideColor]);

  const whiteMaterials = useMemo(() => {
    const shared = new MeshStandardMaterial({
      color: insideColor,
      roughness: 0.05,
    });

    return [shared, shared, shared, shared];
  }, [insideColor]);

  return useMemo(
    () => [...whiteMaterials, back, front],
    [whiteMaterials, back, front]
  );
}
