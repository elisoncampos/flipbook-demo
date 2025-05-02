import { useTexture } from "@react-three/drei";
import { useEffect } from "react";

interface PreloaderProps {
  urls?: (string | null | undefined)[];
}

export const usePreloader = ({ urls = [] }: PreloaderProps) => {
  useEffect(() => {
    if (!urls) return;

    urls.forEach((url) => {
      if (!url) return;
      useTexture.preload(url);
    });
  }, [urls]);
};
