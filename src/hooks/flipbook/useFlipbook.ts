import { BookActions } from "@/types";
import { useRef } from "react";

export type FlipbookApi = {
  book: {
    ref: React.RefObject<BookActions | null>;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
  };
};

export const useFlipbook = (): FlipbookApi => {
  const bookRef = useRef<BookActions | null>(null);
  const nextPage = () => bookRef.current?.nextPage();
  const prevPage = () => bookRef.current?.prevPage();
  const setPage = (page: number) => bookRef.current?.setPage(page);

  return { book: { ref: bookRef, nextPage, prevPage, setPage } };
};
