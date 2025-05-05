export type BookSettings = {
  book: {
    loaded: boolean;
    images: string[];
    angle: number;
  };
  page: {
    total: number;
    loaded: boolean;
    width: number;
    height: number;
    thickness: number;
    turningSpeed: number;
  };
  cover: {
    loaded: boolean;
    totalWidth: number;
    totalHeight: number;
    front: string | null;
    back: string | null;
    thickness: number;
    insideColor: string;
    outsideColor: string;
    spineWidth: number;
    guardWidth: number;
  };
};

export type PageDefinition = {
  front?: string;
  back?: string;
  color?: string;
  thickness: number;
};

export type BookActions = {
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
};
