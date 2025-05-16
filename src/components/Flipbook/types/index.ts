import { Bone, Group, Object3D, Texture, Vector2 } from "three";

// ================= PROPS ====================
export interface SpineProps {
  frontAnchor: Object3D;
  backAnchor: Object3D;
  frontGuardTexture: Texture | null | undefined;
  backGuardTexture: Texture | null | undefined;
  spineTexture: Texture | null | undefined;
}

export interface CoverPartProps {
  size: Vector2;
  thickness: number;
  position?: [number, number, number];
  visible?: boolean;
  texture: Texture | null | undefined;
}

export interface FlipbookEnvironmentProps {
  environmentUrl?: string;
}

export interface FlipbookSceneProps {
  environmentUrl?: string;
}

export interface LightProps {
  position?: [number, number, number];
  intensity?: number;
  color?: string;
  enableShadows?: boolean;
  lowQuality?: boolean;
}

export interface PagesGathererProps {
  pagesData: PageDefinition[];
}

export interface SinglePageProps {
  data: PageDefinition;
  visible?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export interface TableProps {
  topHeight?: number;
  footerRadius?: number;
  footerHeight?: number;
}

export interface BookProviderProps {
  images: string[];
  frontCover: string | null;
  backCover: string | null;
  preload?: boolean;
  hasGuardPage?: boolean;
  guardPageColor?: string;
}

export interface PreloaderProps {
  urls?: (string | null | undefined)[];
  disabled?: boolean;
}

export interface FlipbookProps {
  pages: string[];
  hasGuardPage?: boolean;
  guardPageColor?: string;
  frontCover: string | null;
  backCover: string | null;
  environmentUrl?: string;
  preload?: boolean;
}
// ================= PROPS ====================

// ================= STORE ====================
export interface BookSettings {
  book: {
    loaded: boolean;
    componentReady: boolean;
    imagesLoaded: boolean;
    images: string[];
    angle: number;
    hasGuardPage: boolean;
    guardPageColor: string | null;
  };
  page: {
    loaded: boolean;
    width: number;
    height: number;
    thickness: number;
  };
  cover: {
    loaded: boolean;
    imagesWidth: number;
    imagesHeight: number;
    totalWidth: number;
    coverWidth: number;
    totalHeight: number;
    front: string | null;
    back: string | null;
    thickness: number;
    insideColor: string;
    outsideColor: string;
    spineWidth: number;
    guardWidth: number;
  };
  flipper: {
    turningSpeed: number;
    totalPages: number;
    currentPage: number;

    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number | ((prev: number) => number)) => void;
    setTotalPages: (total: number) => void;
  };
}
// ================= STORE ====================

export type PageState = BookSettings["page"] & {
  updatePage: (partial: Partial<BookSettings["page"]>) => void;
};

export type CoverState = BookSettings["cover"] & {
  updateCover: (partial: Partial<BookSettings["cover"]>) => void;
};

export type BookState = BookSettings["book"] & {
  updateBook: (partial: Partial<BookSettings["book"]>) => void;
};

// ================= OBJECTS ====================

export type SinglePageObject = Group & {
  thickness: number;
};

export type CoverObject = Group & {
  appendFrontTo: (group: Group, xOffset?: number) => void;
  appendBackTo: (group: Group, xOffset?: number) => void;
};

export interface PagesGathererObject {
  assingPages: (pages: SinglePageObject[]) => void;
  getBones: () => Bone[] | undefined;
}

export interface PagesObject {
  getFirstPage: () => SinglePageObject | undefined;
  getLastPage: () => SinglePageObject | undefined;
}
export interface SpineObject {
  positionDorse: () => void;
}
// ================= OBJECTS ====================

// ================= HOOKS ====================
export interface UseBones {
  pagesData: PageDefinition[];
}

export interface FlipbookApi {
  book: {
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
    loaded: boolean;
    currentPage: number;
    totalPages: number;
  };
}
// ================= HOOKS ====================

// ================= TYPES ====================
export interface PageDefinition {
  front?: string;
  back?: string;
  color?: string;
  thickness: number;
}
// ================= TYPES ====================
