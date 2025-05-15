import { PreloaderProps } from "../../types";
import { useEffect, useState } from "react";
import { TextureLoader } from "three";

export const usePreloader = ({
  urls = [],
  disabled = false,
}: PreloaderProps) => {
  const [loaded, setLoaded] = useState(disabled || !urls || urls.length === 0);

  useEffect(() => {
    if (!urls || urls.length === 0 || disabled) return;

    setLoaded(false);

    const loader = new TextureLoader();
    const promises = urls
      .filter((url): url is string => !!url)
      .map(
        (url) =>
          new Promise<void>((resolve, reject) => {
            loader.load(
              url,
              () => resolve(),
              undefined,
              (err) => reject(`Erro ao carregar ${url}: ${err}`)
            );
          })
      );

    Promise.allSettled(promises)
      .then(() => setLoaded(true))
      .catch((err) => {
        console.error(err);
      });
  }, [disabled, urls]);

  return loaded;
};
