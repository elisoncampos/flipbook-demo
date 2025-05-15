import { BookState } from "../types";
import { create } from "zustand";

export const useBookStore = create<BookState>((set) => ({
  angle: 0.65,
  loaded: false,
  hasGuardPage: false,
  guardPageColor: null,
  componentReady: false,
  imagesLoaded: false,
  images: [],
  updateBook: (partial) => set((state) => ({ ...state, ...partial })),
}));
