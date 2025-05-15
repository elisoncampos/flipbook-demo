import { useBookStore } from "../../stores/book";
import { useFlipperStore } from "../../stores/flipper";
import { FlipbookApi } from "../../types";
import { useShallow } from "zustand/shallow";

export const useFlipbook = (): FlipbookApi => {
  const loaded = useBookStore((state) => state.loaded);

  const { nextPage, prevPage, setPage } = useFlipperStore(
    useShallow((state) => ({
      nextPage: state.nextPage,
      prevPage: state.prevPage,
      setPage: state.setPage,
    }))
  );

  const currentPage = useFlipperStore((state) => state.currentPage);
  const totalPages = useFlipperStore((state) => state.totalPages);

  return {
    book: { nextPage, prevPage, setPage, loaded, currentPage, totalPages },
  };
};
