import { BookSettings } from "@/types";
import { create } from "zustand";

type BookState = BookSettings["book"] & {
  updateBook: (partial: Partial<BookSettings["book"]>) => void;
};

export const useBookStore = create<BookState>((set) => ({
  angle: 0.45,
  loaded: false,
  images: [],
  updateBook: (partial) => set((state) => ({ ...state, ...partial })),
}));