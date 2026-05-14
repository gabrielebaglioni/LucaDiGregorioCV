import assetsJson from "./assets.json";
import type { AssetsDataV4, IndexEntry } from "./types/assets";

const assets = assetsJson as unknown as AssetsDataV4;

export interface ProductVm {
  id: string;
  category: string;
  name: string;
  description: {
    bodyCopy1: string | null;
    bodyCopy2: string | null;
  };
  designer: string;
  price: number;
  year: number | string | null;
  date: string | null;
  fileType: string;
  dimensions: string;
  previewImg: string;
  productImages: string[];
  compatibility: string;
}

const entriesByYear = assets.index ?? {};

const products: ProductVm[] = Object.entries(entriesByYear)
  .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
  .flatMap(([, entries]) => entries)
  .map((entry: IndexEntry) => ({
    id: entry.slug,
    category: "work",
    name: entry.title,
    description: { bodyCopy1: entry.description ?? null, bodyCopy2: null },
    designer: entry.materials || "mixed media",
    price: 0,
    year: entry.year ?? null,
    date: entry.date ?? null,
    fileType: "JPG",
    dimensions: entry.dimensions || "",
    previewImg: entry.indexImage,
    productImages: [entry.detailImage || entry.indexImage].filter(Boolean),
    compatibility: "—",
  }));

export default products;

