import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { PagesGatherer } from "./PagesGatherer";
import { useShallow } from "zustand/shallow";
import { SinglePage } from "./SinglePage";
import { useFlipperStore } from "../../stores/flipper";
import { createPages } from "../../utils/createPages";
import { useBookStore } from "../../stores/book";
import { usePageStore } from "../../stores/page";
import { useCoverStore } from "../../stores/cover";
import {
  PagesGathererObject,
  PagesObject,
  SinglePageObject,
} from "../../types";

export const Pages = forwardRef<PagesObject>((_, ref) => {
  const gathererRef = useRef<PagesGathererObject>(null);
  const pagesRef = useRef<SinglePageObject[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      getFirstPage() {
        return pagesRef.current[0];
      },
      getLastPage() {
        return pagesRef.current[pagesRef.current.length - 1];
      },
    }),
    []
  );

  const setPage = useFlipperStore((state) => state.setPage);
  const bookImages = useBookStore(useShallow((state) => state.images));
  const pageThickness = usePageStore((state) => state.thickness);
  const coverInsideColor = useCoverStore((state) => state.insideColor);
  const hasGuardPage = useBookStore((state) => state.hasGuardPage);
  const guardPageColor = useBookStore((state) => state.guardPageColor);

  const pages = useMemo(() => {
    const pairedPages = createPages(
      bookImages,
      pageThickness,
      coverInsideColor
    );

    const firstPage = pairedPages[0];
    const lastPage = pairedPages[pairedPages.length - 1];

    if (hasGuardPage) {
      firstPage.color = guardPageColor || coverInsideColor;
      lastPage.color = guardPageColor || coverInsideColor;

      pairedPages.unshift({
        color: guardPageColor || coverInsideColor,
        thickness: pageThickness / 3,
      });
      pairedPages.push({
        color: guardPageColor || coverInsideColor,
        thickness: pageThickness / 3,
      });
    } else {
      firstPage.thickness = pageThickness / 3;
      lastPage.thickness = pageThickness / 3;
    }

    return pairedPages;
  }, [
    bookImages,
    coverInsideColor,
    guardPageColor,
    hasGuardPage,
    pageThickness,
  ]);

  const handlePageClick = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setPage((prevPage) => (prevPage - 1 === index ? index : index + 1));
    },
    [setPage]
  );

  const renderedPages = useMemo(() => {
    return pages.map((item, index) => (
      <SinglePage
        ref={(el) => {
          if (el) pagesRef.current[index] = el;
        }}
        key={index}
        data={item}
        onClick={handlePageClick(index)}
      />
    ));
  }, [pages, handlePageClick]);

  useEffect(() => {
    if (!gathererRef.current) return;
    if (!pagesRef.current) return;

    gathererRef.current.assingPages(pagesRef.current);
  }, []);

  return (
    <>
      <PagesGatherer pagesData={pages} ref={gathererRef} />
      {renderedPages}
    </>
  );
});
