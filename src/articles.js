import assets from "./assets.json";

const selected = assets?.gallery ?? [];

const articles = selected.map((item, idx) => ({
  id: `A${String(idx + 1).padStart(3, "0")}`,
  slug: item.slug || item.id,
  title: item.title,
  bannerImg: item.galleryImage,
  detailImg: item.detailImage || item.galleryImage,
  bodyCopy: item.description ? [item.description] : [],
  materials: item.materials || "—",
  dimensions: item.dimensions || "—",
  date: item.date,
}));

export default articles;
