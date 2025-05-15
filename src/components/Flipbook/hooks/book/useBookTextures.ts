import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  TextureLoader,
  CanvasTexture,
  ClampToEdgeWrapping,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";

/**
 * Load a texture from URL using Three.js TextureLoader
 * For synchronous loading (outside of React components)
 */
export const generateImageTexture = (imageUrl: string) => {
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
export const createPaperTexture = () => {
  // quadrado de 10x10 pixels com cor RGB(250, 250, 250) e borda com cor RGB(200, 200, 200)
  const base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAALklEQVR4nGM8ceIEA27AwsDAYGRkhFXu3LlzTHi0MjAwDF1pFgYGhnPnzuGSBgAczAfawi6YjgAAAABJRU5ErkJggg==`;

  const texture = new TextureLoader().load(base64);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 1);

  return texture;
};

export const generateColorTexture = (color: string) => {
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
      ? generateImageTexture(imageUrl)
      : generateColorTexture(fallbackColor);

    const backTexture = backImageUrl
      ? generateImageTexture(backImageUrl)
      : generateColorTexture(fallbackColor);

    // Apply consistent settings to loaded textures
    if (frontTexture) {
      frontTexture.wrapS = ClampToEdgeWrapping;
      frontTexture.wrapT = ClampToEdgeWrapping;
      frontTexture.center.set(0.5, 0.5);
      frontTexture.offset.set(0, 0);
      frontTexture.repeat.set(1, 1);
      frontTexture.colorSpace = SRGBColorSpace;
    }

    if (backTexture) {
      backTexture.wrapS = ClampToEdgeWrapping;
      backTexture.wrapT = ClampToEdgeWrapping;
      backTexture.center.set(0.5, 0.5);
      backTexture.offset.set(0, 0);
      backTexture.repeat.set(1, 1);
      backTexture.colorSpace = SRGBColorSpace;
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
