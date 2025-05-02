export const crop = (
  url: string,
  width: number,
  height: number,
  type: string
) => {
  const noprotocol = url.replace(/^https?:\/\//, "");
  return `https://alfred-sharp.alboompro.com/crop/width/${
    width / 2
  }/height/${height}/mp/${type}/type/jpeg/url/${noprotocol}`;
};
