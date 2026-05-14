export type IsoDateString = string;

export interface EditorGuide {
  purpose: string;
  generalRule: string;
  gallery: {
    folder: string;
    shape: string;
    idealSizePx: string;
    minimumSizePx: string;
    orderRule: string;
  };
  index: {
    folder: string;
    shape: string;
    idealSizePx: string;
    minimumSizePx: string;
    orderRule: string;
  };
  detail: {
    folder: string;
    shape: string;
    recommendedLongestSidePx: string;
    minimumLongestSidePx: string;
    rule: string;
  };
  slider: {
    folder: string;
    rule: string;
  };
  editableFields: string[];
}

export interface SliderConfig {
  homeHero: string;
  homeCarousel: string[];
}

export interface GalleryEntry {
  slug: string;
  title: string;
  dimensions: string;
  materials: string;
  year: number | null;
  date: IsoDateString | null;
  description: string | null;
  galleryImage: string;
  detailImage: string;
}

export interface IndexEntry {
  slug: string;
  title: string;
  dimensions: string;
  materials: string;
  year: number | string | null;
  date: IsoDateString | null;
  description: string | null;
  indexImage: string;
  detailImage: string;
}

export interface AssetsDataV4 {
  generatedAt: string;
  structureVersion: 4;
  editorGuide: EditorGuide;
  slider: SliderConfig;
  gallery: GalleryEntry[];
  index: Record<string, IndexEntry[]>;
}

