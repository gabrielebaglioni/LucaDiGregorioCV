import assets from "./assets.json";

const LOREM_1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_2 =
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

function getIndexOrderFromPath(path) {
  const fileName = String(path || "").split("/").pop() || "";
  const match = fileName.match(/^(\d+)-/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

const products = (assets?.items ?? [])
  .filter((item) => item?.images?.index)
  .slice()
  .sort((a, b) => {
    const aYear = Number.isFinite(a?.year) ? a.year : null;
    const bYear = Number.isFinite(b?.year) ? b.year : null;

    // items without year go at the end
    if (aYear == null && bYear != null) return 1;
    if (aYear != null && bYear == null) return -1;
    if (aYear != null && bYear != null && aYear !== bYear) return bYear - aYear;

    const aOrder = getIndexOrderFromPath(a?.images?.index);
    const bOrder = getIndexOrderFromPath(b?.images?.index);
    if (aOrder !== bOrder) return aOrder - bOrder;

    // stable-ish fallback (keeps a consistent order within the same year)
    return String(a.title || "").localeCompare(String(b.title || ""));
  })
  .map((item) => ({
    id: item.id,
    category: item.kind,
    name: item.title,
    description: { bodyCopy1: item.description ?? LOREM_1, bodyCopy2: LOREM_2 },
    designer: item.materials || "—",
    price: 0,
    year: item.year,
    date: item.date,
    fileType: "JPG",
    dimensions: item.dimensions || "",
    previewImg: item.images.index,
    productImages: [item.images.detail || item.images.index].filter(Boolean),
    compatibility: "—",
  }));

export default products;
