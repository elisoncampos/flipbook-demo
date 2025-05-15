import { useEffect, useMemo } from "react";
import { useBookStore } from "../../stores/book";
import { usePageStore } from "../../stores/page";
import { useCoverStore } from "../../stores/cover";
import { usePreloader } from "../utils/usePreloader";
import { useFlipperStore } from "../../stores/flipper";
import { BookProviderProps } from "../../types";
import { pixelToUnit } from "../../utils/math";

const calculateSize = (image: HTMLImageElement | null) => {
  if (!image) return null;
  return {
    width: pixelToUnit(image.width),
    height: pixelToUnit(image.height),
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
  preload = true,
  hasGuardPage = false,
  guardPageColor,
}: BookProviderProps) {
  const allUrls = useMemo(() => {
    return [...images, frontCover, backCover];
  }, [backCover, frontCover, images]);

  const imagesLoaded = usePreloader({
    urls: allUrls,
    disabled: !preload,
  });

  const setTotalPages = useFlipperStore((state) => state.setTotalPages);
  const updateBook = useBookStore((state) => state.updateBook);
  const componentReady = useBookStore((state) => state.componentReady);

  const updatePage = usePageStore((state) => state.updatePage);
  const pageLoaded = usePageStore((state) => state.loaded);

  const updateCover = useCoverStore((state) => state.updateCover);
  const coverLoaded = useCoverStore((state) => state.loaded);

  const thickness = 0.005;
  const spineWidth = thickness * (images.length / 2) + thickness * 2;
  const guardWidth = spineWidth / 2;

  useEffect(() => {
    updateBook({ images });

    if (images.length === 0) {
      updatePage({ loaded: true });
      return;
    }

    loadImage(images[0])
      .then((image) => {
        const size = calculateSize(image);
        const { width = 0, height = 0 } = size || {};

        updatePage({
          loaded: true,
          width,
          height,
          thickness,
        });

        updateCover({
          thickness: thickness * 2,
          spineWidth,
          guardWidth,
        });
      })
      .catch(() => updatePage({ loaded: true }));
  }, [
    guardWidth,
    images,
    setTotalPages,
    spineWidth,
    updateBook,
    updateCover,
    updatePage,
  ]);

  useEffect(() => {
    updateBook({
      hasGuardPage,
      guardPageColor,
    });

    let totalPages = Math.ceil(images.length / 2);
    if (hasGuardPage) {
      totalPages += 2;
    }
    setTotalPages(totalPages);
  }, [guardPageColor, hasGuardPage, images.length, setTotalPages, updateBook]);

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

        const widthAdjustment = spineWidth + thickness * 2;

        const margin = 0.04 * 2; // 4mm de cada lado
        let totalWidth = frontCover && backCover ? size.width * 2 : size.width;
        totalWidth += margin;
        const aspectRatio = size.height / totalWidth;

        // somando a largura da lombada pra não parecer que a capa é menor que a pagina
        totalWidth += widthAdjustment;

        // Mantém o aspecto da imagem da capa original
        const totalHeight = totalWidth * aspectRatio;

        updateCover({
          loaded: true,
          totalWidth,
          totalHeight,
          front: frontCover,
          back: backCover,
        });
      })
      .catch(() => updateCover({ loaded: true }));
  }, [frontCover, backCover, updateCover, spineWidth]);

  useEffect(() => {
    if (pageLoaded && coverLoaded && imagesLoaded) {
      updateBook({ imagesLoaded: true });
    }
  }, [pageLoaded, coverLoaded, updateBook, imagesLoaded]);

  useEffect(() => {
    if (imagesLoaded && componentReady) {
      updateBook({ loaded: true });
    }
  }, [imagesLoaded, componentReady, updateBook]);
}
