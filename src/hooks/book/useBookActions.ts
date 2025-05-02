import { usePageStore } from "@/stores/page";
import { BookActions } from "@/types";
import { useState, useImperativeHandle, useRef, useEffect } from "react";
import { Group } from "three";

export const useBookActions = (ref: React.Ref<BookActions | null>) => {
  const totalPages = usePageStore((state) => state.total);

  // ref that will receive object actions
  const objectRef = useRef<Group>(null);

  const getObject = () => {
    if (!objectRef.current) {
      throw new Error("Object ref is not set");
    }
    return objectRef.current;
  };

  const timeout = useRef<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [delayedPage, setDelayedPage] = useState<number>(1);

  useEffect(() => {
    const goToPage = () => {
      setDelayedPage((prevDelayedPage) => {
        if (currentPage === prevDelayedPage) {
          return prevDelayedPage;
        }

        timeout.current = window.setTimeout(
          () => {
            goToPage();
          },
          Math.abs(currentPage - prevDelayedPage) > 2 ? 150 : 200
        );

        const nextPage =
          currentPage > prevDelayedPage
            ? prevDelayedPage + 1
            : prevDelayedPage - 1;

        // TODO: depois da demo remover restrição de páginas
        return Math.min(Math.max(nextPage, 1), totalPages + 1);
      });
    };

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    goToPage();

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [currentPage, totalPages]);

  const setPage = (index: number) => {
    setCurrentPage(index);
  };

  const nextPage = () => {
    setPage(currentPage + 1);
  };

  const prevPage = () => {
    setPage(currentPage - 1);
  };

  // ref will receive book actions and object actions
  useImperativeHandle(ref, () => {
    return {
      getObject,
      nextPage,
      prevPage,
      setPage,
    };
  });

  /* useControls("Book", {
    currentPage: {
      value: currentPage,
      min: 0,
      max: page.total + 2,
      step: 1,
      onChange: (value) => {
        setCurrentPage(value);
      },
    },
  }); */

  return {
    bookRef: objectRef,
    currentPage: delayedPage,
    getObject,
    nextPage,
    prevPage,
    setPage,
  };
};
