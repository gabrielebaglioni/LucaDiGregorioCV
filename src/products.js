import assets from "./assets.json";

const LOREM_1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_2 =
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const products = (assets?.items ?? [])
  .filter((item) => item?.image)
  .slice()
  .sort((a, b) => {
    const aYear = Number.isFinite(a?.year) ? a.year : null;
    const bYear = Number.isFinite(b?.year) ? b.year : null;

    // items without year go at the end
    if (aYear == null && bYear != null) return 1;
    if (aYear != null && bYear == null) return -1;
    if (aYear != null && bYear != null && aYear !== bYear) return bYear - aYear;

    // stable-ish fallback (keeps a consistent order within the same year)
    return String(a.title || "").localeCompare(String(b.title || ""));
  })
  .map((item) => ({
    id: item.id,
    category: item.kind,
    name: item.title,
    description: { bodyCopy1: item.description ?? LOREM_1, bodyCopy2: LOREM_2 },
    designer: "Lorem Ipsum",
    price: 0,
    year: item.year,
    date: item.date,
    fileType: "JPG",
    previewImg: item.image, // absolute public path: /asset/...
    productImages: item.images?.length ? item.images : [item.image],
    compatibility: "—",
  }));

export default products;
