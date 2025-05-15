import { PageDefinition } from "../types";

/**
 * Creates an array of page definitions by pairing consecutive pages as front and back
 *
 * @param pages - Array of image URLs (can contain empty/null values)
 * @returns Array of PageDefinition objects, each containing front and back image URLs or fallbacks
 *
 * For example:
 * - pages[0] becomes the front of page 1
 * - pages[1] becomes the back of page 1
 * - pages[2] becomes the front of page 2
 * - and so on
 *
 * If any image URL is empty/undefined/null, a white texture is used via a data URI.
 */
export const createPages = (
  pages: string[],
  thickness: number,
  fallbackColor: string
): PageDefinition[] => {
  const ret: PageDefinition[] = [];

  if (pages.length > 0) {
    // Primeira página: frente nula, verso é a primeira imagem
    ret.push({
      front: undefined,
      back: pages[0],
      thickness,
      color: fallbackColor,
    });
  }

  // Começar do índice 1, pois a primeira imagem já foi usada
  for (let i = 1; i < pages.length; i += 2) {
    const frontImage = pages[i];
    const backImage = pages[i + 1];

    ret.push({
      front: frontImage,
      back: backImage,
      thickness,
      color: fallbackColor,
    });
  }

  // caso o número de páginas seja ímpar, adiciona a última página
  if (pages.length % 2 !== 0) {
    ret.push({
      front: undefined,
      back: undefined,
      thickness,
      color: fallbackColor,
    });
  }

  return ret;
};
