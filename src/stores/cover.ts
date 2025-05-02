import { BookSettings } from "@/types";
import { create } from "zustand";

type CoverState = BookSettings["cover"] & {
  updateCover: (partial: Partial<BookSettings["cover"]>) => void;
};

export const useCoverStore = create<CoverState>((set) => ({
  loaded: false,
  totalWidth: 0,
  totalHeight: 0,
  thickness: 0,
  front: null,
  back: null,
  insideColor: "#afafaf",
  outsideColor: "#5f5f5f",
  spineWidth: 0,
  guardWidth: 0,
  updateCover: (partial) => set((state) => ({ ...state, ...partial })),
}));
