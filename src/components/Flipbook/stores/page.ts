import { PageState } from "../../types";
import { create } from "zustand";

export const usePageStore = create<PageState>((set) => ({
  loaded: false,
  width: 0,
  height: 0,
  thickness: 0,
  updatePage: (partial) => set((state) => ({ ...state, ...partial })),
}));
