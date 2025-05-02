import { PageDefinition } from "@/types";

/**
 * Pre-generated base64 data URI of a plain white square image (1x1 pixel)
 * More efficient than creating a canvas element each time
 */
export const WHITE_TEXTURE_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

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
export const createPages = (pages: string[], thickness: number): PageDefinition[] => {
  const ret: PageDefinition[] = [];

  for (let i = 0; i < pages.length; i += 2) {
    // Process the front page, use white texture if URL is falsy
    const frontImage = pages[i] || WHITE_TEXTURE_URI;

    // Process the back page, handle both odd page count and falsy URLs
    const backImage =
      i + 1 < pages.length
        ? pages[i + 1] || WHITE_TEXTURE_URI
        : WHITE_TEXTURE_URI;

    ret.push({
      front: frontImage,
      back: backImage,
      thickness,
    });
  }

  return ret;
};
