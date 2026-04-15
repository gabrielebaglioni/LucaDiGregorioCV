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

const items = (assets?.items ?? [])
  .filter((i) => i?.image)
  .slice()
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const paintings = items.filter((i) => i.kind === "painting").slice(0, 10);
const papers = items.filter((i) => i.kind === "paper").slice(0, 10);
const sculptures = items.filter((i) => i.kind === "sculpture").slice(0, 10);

// "random che non stanno nelle sotto cartelle" = file direttamente sotto /asset/
const rootAssets = items.filter((i) => /^\/asset\/[^/]+\.(jpe?g|png|gif|webp)$/i.test(i.image));
const usedIds = new Set([...paintings, ...papers, ...sculptures].map((i) => i.id));
const rootPool = rootAssets.filter((i) => !usedIds.has(i.id));

const seed = hashString(String(assets?.generatedAt ?? "assets"));
const rand = mulberry32(seed);
const randomRoot = seededShuffle(rootPool, rand).slice(0, 10);

// pattern: paper, painting, painting, sculpture, random, repeat
const buckets = {
  paper: papers.slice(),
  painting: paintings.slice(),
  sculpture: sculptures.slice(),
  random: randomRoot.slice(),
};
const cycle = ["paper", "painting", "painting", "sculpture", "random"];

const selected = [];
let safety = 0;
while (safety++ < 1000) {
  const hasAny = Object.values(buckets).some((b) => b.length > 0);
  if (!hasAny) break;
  for (const key of cycle) {
    if (buckets[key].length > 0) selected.push(buckets[key].shift());
  }
}

const articles = selected.map((item, idx) => ({
  id: `A${String(idx + 1).padStart(3, "0")}`,
  title: item.title,
  bannerImg: item.image, // absolute public path: /asset/...
  bodyCopy: [item.description ?? LOREM_PARA, LOREM_PARA, LOREM_PARA],
  author: item.kind,
  date: item.date,
  tags: [item.kind, String(item.year)],
}));

export default articles;
