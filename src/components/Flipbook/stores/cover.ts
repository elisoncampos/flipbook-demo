import { CoverState } from "../types";
import { create } from "zustand";

const keysToWatch = ["totalWidth", "guardWidth", "spineWidth"];

export const useCoverStore = create<CoverState>((set, get) => {
  const updateCoverWidth = () => {
    const state = get();
    const coverWidth =
      (state.totalWidth - state.guardWidth * 2 - state.spineWidth) / 2;
    set({ coverWidth });
  };

  return {
    loaded: false,
    totalWidth: 0,
    totalHeight: 0,
    coverWidth: 0,
    thickness: 0,
    front: null,
    back: null,
    insideColor: "#afafaf",
    outsideColor: "#5f5f5f",
    spineWidth: 0,
    guardWidth: 0,
    updateCover: (partial) => {
      set((state) => ({ ...state, ...partial }));

      const shouldUpdateWidth = keysToWatch.some((key) =>
        Object.prototype.hasOwnProperty.call(partial, key)
      );

      if (shouldUpdateWidth) {
        updateCoverWidth();
      }
    },
  };
});
