import { useEffect } from "react";
import { useBookStore } from "@/stores/book";
import { usePageStore } from "@/stores/page";
import { useCoverStore } from "@/stores/cover";
import { usePreloader } from "../utils/usePreloader";

interface BookProviderProps {
  images: string[];
  frontCover: string | null;
  backCover: string | null;
}

const calculateSize = (image: HTMLImageElement | null) => {
  if (!image) return null;
  return {
    width: image.width / 1000,
    height: image.height / 1000,
  };
};

const loadImage = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (img.complete) resolve(img);
  });
};

export function useBookLoader({
  images,
  frontCover,
  backCover,
}: BookProviderProps) {
  usePreloader({
    urls: [...images, frontCover, backCover],
  });

  const updateBook = useBookStore((state) => state.updateBook);
  const updatePage = usePageStore((state) => state.updatePage);
  const updateCover = useCoverStore((state) => state.updateCover);

  useEffect(() => {
    updateBook({ images });
    updatePage({ total: images.length / 2 });

    if (images.length === 0) {
      updatePage({ loaded: true });
      return;
    }

    loadImage(images[0])
      .then((image) => {
        const size = calculateSize(image);
        const { width = 0, height = 0 } = size || {};
        const thickness = 0.01;

        updatePage({
          loaded: true,
          width,
          height,
          thickness,
        });

        const spineWidth = thickness * (images.length / 2) + thickness * 2;
        const guardWidth = Math.min(spineWidth / 2, width / 4);

        updateCover({
          thickness: thickness * 2,
          spineWidth,
          guardWidth,
        });
      })
      .catch(() => updatePage({ loaded: true }));
  }, [images, updateBook, updateCover, updatePage]);

  useEffect(() => {
    const coverImg = frontCover || backCover;

    if (!coverImg) {
      updateCover({ loaded: true });
      return;
    }

    loadImage(coverImg)
      .then((image) => {
        const size = calculateSize(image);
        if (!size) return;

        const coverWidth =
          frontCover && backCover ? size.width * 2 : size.width;

        updateCover({
          loaded: true,
          width: coverWidth,
          height: size.height,
          front: frontCover,
          back: backCover,
        });
      })
      .catch(() => updateCover({ loaded: true }));
  }, [frontCover, backCover, updateCover]);
}
