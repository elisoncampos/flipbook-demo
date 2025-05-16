import { useCallback, useEffect, useMemo } from "react";
import { useBookStore } from "../../stores/book";
import { usePageStore } from "../../stores/page";
import { useCoverStore } from "../../stores/cover";
import { usePreloader } from "../utils/usePreloader";
import { useFlipperStore } from "../../stores/flipper";
import { BookProviderProps } from "../../types";
import { pixelToUnit } from "../../utils/math";

const calculateSize = (image: HTMLImageElement | null) => {
  if (!image) return null;

  const maxWidth = 2048;

  const originalWidth = image.width;
  const originalHeight = image.height;

  const clampedWidth = Math.min(originalWidth, maxWidth);
  const aspectRatio = originalHeight / originalWidth;
  const clampedHeight = clampedWidth * aspectRatio;

  return {
    width: pixelToUnit(clampedWidth),
    height: pixelToUnit(clampedHeight),
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

const calculateSpineWidth = (thickness: number, totalImages: number) => {
  const spineWidth = thickness * Math.ceil(totalImages / 2) + thickness / 4
  return spineWidth;
};

const testedWidth = pixelToUnit(8192);
const idealThickness = 0.035;
const idealMargin = 0.2;

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
  const loaded = useBookStore((state) => state.loaded);
  const componentReady = useBookStore((state) => state.componentReady);

  const updatePage = usePageStore((state) => state.updatePage);
  const pageLoaded = usePageStore((state) => state.loaded);
  const pageWidth = usePageStore((state) => state.width);

  const updateCover = useCoverStore((state) => state.updateCover);
  const coverLoaded = useCoverStore((state) => state.loaded);
  const coverWidth = useCoverStore((state) => state.imagesWidth);
  const coverHeight = useCoverStore((state) => state.imagesHeight);

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
        });
      })
      .catch(() => updatePage({ loaded: true }));
  }, [images, setTotalPages, updateBook, updateCover, updatePage]);

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
    const hasFront = !!frontCover;
    const hasBack = !!backCover;

    if (!hasFront && !hasBack) {
      updateCover({ loaded: true });
      return;
    }

    const maybeLoadImage = (src: string | null | undefined) => {
      return src ? loadImage(src) : Promise.resolve(null);
    };

    Promise.all([maybeLoadImage(frontCover), maybeLoadImage(backCover)])
      .then(([frontImg, backImg]) => {
        let totalWidth = 0;
        let height = 0;

        const frontSize = calculateSize(frontImg);
        if (frontSize) {
          totalWidth += frontSize.width;
          height = Math.max(height, frontSize.height);
        }

        const backSize = calculateSize(backImg);
        if (backSize) {
          totalWidth += backSize.width;
          height = Math.max(height, backSize.height);
        }

        updateCover({
          loaded: true,
          imagesWidth: totalWidth,
          imagesHeight: height,
          front: frontCover,
          back: backCover,
        });
      })
      .catch(() => {
        updateCover({ loaded: true });
      });
  }, [frontCover, backCover, updateCover]);

  const calculateDimensions = useCallback(() => {
    const thickness = idealThickness * (pageWidth / testedWidth);
    updatePage({
      thickness,
    });

    const spineWidth = calculateSpineWidth(thickness, images.length);
    let coverAdjustedWidth = coverWidth;

    const margin = idealMargin * (coverWidth / testedWidth);
    coverAdjustedWidth += margin;

    const aspectRatio = coverHeight / coverAdjustedWidth;

    // somando a largura da lombada pra não parecer que a capa é menor que a pagina
    coverAdjustedWidth += spineWidth;

    // Mantém o aspecto da imagem da capa original
    const coverAdjustedHeight = coverAdjustedWidth * aspectRatio;

    updateCover({
      thickness: thickness * 2,
      spineWidth: calculateSpineWidth(thickness, images.length),
      guardWidth: spineWidth / 2,
      totalWidth: coverAdjustedWidth,
      totalHeight: coverAdjustedHeight,
    });
  }, [
    coverHeight,
    coverWidth,
    images.length,
    pageWidth,
    updateCover,
    updatePage,
  ]);

  useEffect(() => {
    if (pageLoaded && coverLoaded && imagesLoaded && !loaded) {
      calculateDimensions();
      updateBook({ imagesLoaded: true });
    }
  }, [
    pageLoaded,
    coverLoaded,
    updateBook,
    imagesLoaded,
    loaded,
    calculateDimensions,
  ]);

  useEffect(() => {
    if (imagesLoaded && componentReady) {
      updateBook({ loaded: true });
    }
  }, [imagesLoaded, componentReady, updateBook]);
}
