import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  TextureLoader,
  CanvasTexture,
  ClampToEdgeWrapping,
  RepeatWrapping,
} from "three";

/**
 * Load a texture from URL using Three.js TextureLoader
 * For synchronous loading (outside of React components)
 */
export const useImageTexture = (imageUrl: string) => {
  const texture = new TextureLoader().load(imageUrl);
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.center.set(0.5, 0.5);
  texture.offset.set(0, 0);
  texture.repeat.set(1, 1);
  return texture;
};

/**
 * Hook to load a paper texture
 * Uses React hooks and drei's useTexture for better performance
 */
export const usePaperTexture = () => {
  // TODO: mudar a url
  const texture = useTexture("https://picsum.photos/id/255/512/512");
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
};

export const useColorTexture = (color: string) => {
  const size = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  }

  const texture = new CanvasTexture(canvas);
  return texture;
};


/**
 * Hook to load page textures (front and back)
 * Uses React hooks and drei's useTexture for better performance and caching
 * Handles white texture via direct data URI
 */
export const usePageTextures = (
  imageUrl?: string,
  backImageUrl?: string,
  fallbackColor: string = "white"
) => {
  return useMemo(() => {
    // Use useTexture for all image URLs (including the white texture data URI)
    // For non-image cases, generate text textures
    const frontTexture = imageUrl
      ? useImageTexture(imageUrl)
      : useColorTexture(fallbackColor);

    const backTexture = backImageUrl
      ? useImageTexture(backImageUrl)
      : useColorTexture(fallbackColor);

    // Apply consistent settings to loaded textures
    if (frontTexture) {
      frontTexture.wrapS = ClampToEdgeWrapping;
      frontTexture.wrapT = ClampToEdgeWrapping;
      frontTexture.center.set(0.5, 0.5);
      frontTexture.offset.set(0, 0);
      frontTexture.repeat.set(1, 1);
    }

    if (backTexture) {
      backTexture.wrapS = ClampToEdgeWrapping;
      backTexture.wrapT = ClampToEdgeWrapping;
      backTexture.center.set(0.5, 0.5);
      backTexture.offset.set(0, 0);
      backTexture.repeat.set(1, 1);
    }

    return { frontTexture, backTexture };
  }, [fallbackColor, imageUrl, backImageUrl]);
};

/**
 * Hook to load cover textures
 */
export const useCoverTexture = (
  isFront: boolean,
  coverImage: string | null
) => {
  // Default textures if no cover image is provided
  const defaultImageUrl = isFront
    ? "https://picsum.photos/id/944/1500/2000" // Default front cover
    : "https://picsum.photos/id/821/1500/2000"; // Default back cover

  // Use provided cover image or fall back to default
  const imageToUse = coverImage || defaultImageUrl;
  const texture = useTexture(imageToUse);

  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.center.set(0.5, 0.5);
  texture.offset.set(0, 0);
  texture.repeat.set(1, 1);

  return texture;
};
