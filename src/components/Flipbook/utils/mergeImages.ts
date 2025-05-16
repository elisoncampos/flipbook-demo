export const waitForImageLoad = (img: HTMLImageElement): Promise<void> =>
  new Promise((resolve) => {
    if (img.complete) resolve();
    else img.onload = () => resolve();
  });

interface MergeImagesProps {
  totalHeight: number;
  totalWidth: number;
  frontImg: HTMLImageElement | undefined | null;
  backImg: HTMLImageElement | undefined | null;
}

export const mergeImages = async ({
  totalHeight,
  totalWidth,
  frontImg,
  backImg,
}: MergeImagesProps): Promise<HTMLImageElement | null> => {
  if (!frontImg && !backImg) return null;

  await Promise.all([
    frontImg && waitForImageLoad(frontImg),
    backImg && waitForImageLoad(backImg),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  const drawScaledCentered = (
    img: HTMLImageElement,
    offsetX: number,
    sectionWidth: number
  ) => {
    const aspectRatio = img.width / img.height;

    // Calcular escala para preencher o espaço disponível mantendo proporção
    let drawWidth = sectionWidth * aspectRatio;
    let drawHeight = totalHeight * aspectRatio;

    if (drawHeight > totalHeight) {
      drawHeight = totalHeight;
      drawWidth = totalHeight * aspectRatio;
    }

    const dx = offsetX + (sectionWidth - drawWidth) / 2;
    const dy = (totalHeight - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  };

  const hasTwoImages = frontImg && backImg;

  const sectionWidth = hasTwoImages ? totalWidth / 2 : totalWidth;

  if (!hasTwoImages && backImg) {
    frontImg = backImg;
    backImg = null;
  }

  if (frontImg) drawScaledCentered(frontImg, 0, sectionWidth);
  if (backImg) drawScaledCentered(backImg, sectionWidth, sectionWidth);

  const combinedImage = new Image();
  combinedImage.crossOrigin = "anonymous";
  combinedImage.src = canvas.toDataURL("image/png");
  await waitForImageLoad(combinedImage);

  return combinedImage;
};
