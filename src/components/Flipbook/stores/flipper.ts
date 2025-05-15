import { BookSettings } from "../types";
import { create } from "zustand";

export const useFlipperStore = create<BookSettings["flipper"]>((set, get) => {
  let animationTimeout: ReturnType<typeof setTimeout> | null = null;

  const animateToPage = (targetPage: number) => {
    if (animationTimeout) clearTimeout(animationTimeout);

    const step = () => {
      const { currentPage } = get();

      if (currentPage === targetPage) return;

      const nextPage =
        currentPage < targetPage ? currentPage + 1 : currentPage - 1;
      const delay = Math.abs(targetPage - currentPage) > 2 ? 150 : 200;

      set({ currentPage: nextPage });

      animationTimeout = setTimeout(step, delay);
    };

    step();
  };

  return {
    totalPages: 1,
    currentPage: 0,
    turningSpeed: 0.025,

    setTotalPages: (total: number) => set({ totalPages: total }),

    setPage: (pageInput: number | ((prev: number) => number)) => {
      const state = get();
      const targetPage =
        typeof pageInput === "function"
          ? pageInput(state.currentPage)
          : pageInput;

      animateToPage(targetPage);
    },

    nextPage: () => {
      const { currentPage, totalPages, setPage } = get();
      if (currentPage < totalPages + 1) setPage((p) => p + 1);
    },

    prevPage: () => {
      const { currentPage, setPage } = get();
      if (currentPage > 0) setPage((p) => p - 1);
    },
  };
});
