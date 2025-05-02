import { BookSettings } from "@/types";
import { create } from "zustand";

type CoverState = BookSettings["cover"] & {
  updateCover: (partial: Partial<BookSettings["cover"]>) => void;
};

export const useCoverStore = create<CoverState>((set) => ({
  loaded: false,
  width: 0,
  height: 0,
  thickness: 0,
  front: null,
  back: null,
  insideColor: "#9c8672",
  spineWidth: 0,
  guardWidth: 0,
  updateCover: (partial) => set((state) => ({ ...state, ...partial })),
}));
