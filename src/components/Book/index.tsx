import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useBookActions } from "@/hooks/book/useBookActions";
import { Group } from "three";
import { createPages } from "@/utils/createPages";
import { BookActions } from "@/types";
import { Page } from "./Page";
import { PagesGathererActions, PagesGatherer } from "./PagesGatherer";
import { Spine, SpineActions } from "./Spine";
import { CoverPage } from "./CoverPage";
import { useBookStore } from "@/stores/book";
import { usePageStore } from "@/stores/page";
import { useCoverStore } from "@/stores/cover";

export const Book = forwardRef<BookActions | null>((_, ref) => {
  const frontRef = useRef<Group>(null);
  const backRef = useRef<Group>(null);
  const spineRef = useRef<SpineActions>(null);
  const pagesRef = useRef<Group[]>([]);

  const gathererRef = useRef<PagesGathererActions>(null);

  const { bookRef, currentPage, setPage } = useBookActions(ref);

  const bookImages = useBookStore((state) => state.images);
  const bookAngle = useBookStore((state) => state.angle);

  const pageThickness = usePageStore((state) => state.thickness);

  const coverThickness = useCoverStore((state) => state.thickness);
  const coverGuardWidth = useCoverStore((state) => state.guardWidth);
  const coverInsideColor = useCoverStore((state) => state.insideColor);

  const pages = useMemo(() => {
    const pairedPages = createPages(
      bookImages,
      pageThickness,
      coverInsideColor
    );

    return [
      {
        color: coverInsideColor,
        thickness: pageThickness / 3,
      },
      ...pairedPages,
      {
        color: coverInsideColor,
        thickness: pageThickness / 3,
      },
    ];
  }, [bookImages, coverInsideColor, pageThickness]);

  useEffect(() => {
    if (!gathererRef.current) return;
    if (!pagesRef.current) return;
    if (!frontRef.current) return;
    if (!backRef.current) return;
    if (!spineRef.current) return;

    gathererRef.current.assingPages(pagesRef.current);

    const front = frontRef.current;
    pagesRef.current[0].add(front);
    front.position.x = -coverThickness / 2;

    const back = backRef.current;
    pagesRef.current[pagesRef.current.length - 1].add(back);
    back.position.x = coverThickness / 2;

    const spineBones = spineRef.current.getBones();
    if (!spineBones) return;

    const spine = spineRef.current.getObject()!;
    front.add(spine);

    const targetBone = spineBones[spineBones.length - 1];
    back.add(targetBone);
    targetBone.position.z = coverGuardWidth + coverThickness / 2;
  }, [coverGuardWidth, coverThickness]);

  const renderedPages = useMemo(() => {
    return pages.map((item, index) => (
      <Page
        ref={(el) => {
          if (el) pagesRef.current[index] = el;
        }}
        key={index}
        data={item}
        onClick={(e) => {
          e.stopPropagation();
          if (currentPage - 1 === index) {
            setPage(index);
          } else {
            setPage(index + 1);
          }
        }}
      />
    ));
  }, [pages, currentPage, setPage]);

  return (
    <group ref={bookRef} rotation-x={-bookAngle}>
      <CoverPage ref={frontRef} />
      <CoverPage ref={backRef} />
      <PagesGatherer
        currentPage={currentPage}
        pagesData={pages}
        ref={gathererRef}
      />
      {renderedPages}
      <Spine ref={spineRef} />
    </group>
  );
});
