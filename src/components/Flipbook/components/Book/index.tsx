import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { useCoverStore } from "../../stores/cover";
import { useBookStore } from "../../stores/book";
import { Cover } from "../Cover/Cover";
import { Pages } from "../Pages/Pages";
import { useFlipperStore } from "../../stores/flipper";
import { useFrame } from "@react-three/fiber";
import { lerp } from "three/src/math/MathUtils.js";
import { CoverObject, PagesObject } from "../../types";

export const Book = () => {
  const bookRef = useRef<Group>(null);
  const coverRef = useRef<CoverObject>(null);
  const pagesRef = useRef<PagesObject>(null);

  const updateBook = useBookStore((state) => state.updateBook);
  const bookAngle = useBookStore((state) => state.angle);
  const coverHeight = useCoverStore((state) => state.totalHeight);
  const coverSpineWidth = useCoverStore((state) => state.spineWidth);

  useEffect(() => {
    if (!coverRef.current || !pagesRef.current) {
      console.error({
        coverRef: coverRef.current,
        pagesRef: pagesRef.current,
      });
      throw new Error("Book not ready");
    }

    const firstPage = pagesRef.current.getFirstPage();
    const lastPage = pagesRef.current.getLastPage();
    if (!firstPage || !lastPage) {
      console.error({
        firstPage,
        lastPage,
      });
      throw new Error("Pages not ready");
    }

    coverRef.current.appendFrontTo(firstPage, firstPage.thickness);
    coverRef.current.appendBackTo(lastPage, lastPage.thickness);

    updateBook({
      componentReady: true,
    });
  }, [updateBook]);

  const currentPage = useFlipperStore((state) => state.currentPage);
  const totalPages = useFlipperStore((state) => state.totalPages);
  const coverTotalWidth = useCoverStore((state) => state.totalWidth);
  const turningSpeed = useFlipperStore((state) => state.turningSpeed);

  const isClosed = useMemo(() => {
    return currentPage < 1 || currentPage >= totalPages + 1;
  }, [currentPage, totalPages]);

  useFrame(() => {
    if (!bookRef.current) {
      return;
    }

    const direction = currentPage > 0 ? 1 : -1;

    bookRef.current.position.x = lerp(
      bookRef.current?.position.x || 0,
      isClosed ? (coverTotalWidth / 4) * direction : coverSpineWidth / 2,
      turningSpeed
    );
  });

  return useMemo(() => {
    return (
      <group
        ref={bookRef}
        rotation-x={-bookAngle}
        position={[-coverTotalWidth / 4, coverHeight / 2, 0]}
      >
        <Cover ref={coverRef} />

        <Pages ref={pagesRef} />
      </group>
    );
  }, [bookAngle, coverHeight, coverTotalWidth]);
};
