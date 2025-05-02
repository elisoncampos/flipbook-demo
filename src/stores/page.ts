import { BookSettings } from "@/types";
import { create } from "zustand";

type PageState = BookSettings["page"] & {
  updatePage: (partial: Partial<BookSettings["page"]>) => void;
};

export const usePageStore = create<PageState>((set) => ({
  total: 0,
  loaded: false,
  width: 0,
  height: 0,
  thickness: 0,
  turningSpeed: 0.02,
  updatePage: (partial) => set((state) => ({ ...state, ...partial })),
}));
