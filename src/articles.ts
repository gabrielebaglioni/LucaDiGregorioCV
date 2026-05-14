import assetsJson from "./assets.json";
import type { AssetsDataV4, GalleryEntry } from "./types/assets";

const assets = assetsJson as unknown as AssetsDataV4;

export interface ArticleVm {
  id: string;
  slug: string;
  title: string;
  bannerImg: string;
  detailImg: string;
  bodyCopy: string[];
  materials: string;
  dimensions: string;
  date: string | null;
}

const entries: GalleryEntry[] = assets.gallery ?? [];

const articles: ArticleVm[] = entries.map((entry, idx) => ({
  id: `A${String(idx + 1).padStart(3, "0")}`,
  slug: entry.slug,
  title: entry.title,
  bannerImg: entry.galleryImage,
  detailImg: entry.detailImage || entry.galleryImage,
  bodyCopy: entry.description ? [entry.description] : [],
  materials: entry.materials || "—",
  dimensions: entry.dimensions || "—",
  date: entry.date ?? null,
}));

export default articles;

