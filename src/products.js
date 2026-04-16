import assets from "./assets.json";

const products = Object.entries(assets?.index ?? {})
  .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
  .flatMap(([, entries]) => entries)
  .map((item) => ({
    id: item.slug,
    category: "work",
    name: item.title,
    description: { bodyCopy1: item.description ?? null, bodyCopy2: null },
    designer: item.materials || "mixed media",
    price: 0,
    year: item.year,
    date: item.date,
    fileType: "JPG",
    dimensions: item.dimensions || "",
    previewImg: item.indexImage,
    productImages: [item.detailImage || item.indexImage].filter(Boolean),
    compatibility: "—",
  }));

export default products;
