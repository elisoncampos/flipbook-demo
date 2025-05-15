import { Canvas } from "@react-three/fiber";
import { FlipbookScene } from "../components/FlipbookScene";
import { useBookLoader } from "../hooks/book/useBookLoader";
import { Preload } from "@react-three/drei";
import { FlipbookProps } from "../types";
import { useMemo } from "react";

export const Flipbook = ({
  pages,
  hasGuardPage = false,
  guardPageColor,
  frontCover,
  backCover,
  environmentUrl,
  preload = true,
}: FlipbookProps) => {
  useBookLoader({
    images: pages,
    frontCover,
    backCover,
    preload,
    hasGuardPage,
    guardPageColor,
  });

  return useMemo(
    () => (
      <Canvas camera={{ position: [0, 3, 10], fov: 45 }} shadows="basic">
        <FlipbookScene environmentUrl={environmentUrl} />
        <Preload all />
      </Canvas>
    ),
    [environmentUrl]
  );
};

export { Flipbook as default };
