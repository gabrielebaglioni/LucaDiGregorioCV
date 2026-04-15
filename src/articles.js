import assets from "./assets.json";

const LOREM_PARA =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pool = (assets?.items ?? []).filter((i) => i?.image);

const seed = hashString(String(assets?.generatedAt ?? "assets"));
const rand = mulberry32(seed);

/** Gallery size 25–30, deterministic for a given assets.json */
const galleryCount = 25 + (seed % 6);

const shuffled = seededShuffle(pool, rand);
const selected = shuffled.slice(0, Math.min(galleryCount, shuffled.length));

const articles = selected.map((item, idx) => ({
  id: `A${String(idx + 1).padStart(3, "0")}`,
  slug: item.slug || item.id,
  title: item.title,
  bannerImg: item.image,
  bodyCopy: [item.description ?? LOREM_PARA, LOREM_PARA, LOREM_PARA],
  author: item.kind,
  date: item.date,
  tags: [item.kind, String(item.year)],
}));

export default articles;
