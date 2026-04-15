import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const publicDir = path.join(projectRoot, "public");
const assetDir = path.join(publicDir, "asset");
const outPath = path.join(projectRoot, "src", "assets.json");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

function isImageFile(filePath) {
  return IMAGE_EXTS.has(path.extname(filePath).toLowerCase());
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && isImageFile(full)) files.push(full);
  }
  return files;
}

function toPublicPath(absPath) {
  const rel = path.relative(publicDir, absPath).split(path.sep).join("/");
  return `/${rel}`;
}

function titleFromFilename(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugFromPublicPath(p) {
  return p
    .replace(/^\/asset\//, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDateFromFilename(filename) {
  // Examples: img20260113_13024926-2.jpg -> 2026-01-13
  const m = filename.match(/img(\d{4})(\d{2})(\d{2})_/i);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function inferYearFromPath(p) {
  // folder names like .../2026/... or .../2025-2026/...
  const parts = p.split("/").filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (/^\d{4}$/.test(part)) return Number(part);
    if (/^\d{4}-\d{4}$/.test(part)) return Number(part.split("-")[1]);
  }
  return null;
}

function kindFromPath(p) {
  if (p.includes("/works/paintings/")) return "painting";
  if (p.includes("/works/papers/")) return "paper";
  if (p.includes("/works/sculptures/")) return "sculpture";
  if (p.includes("/pagina copertina entrata")) return "cover";
  return "asset";
}

const absFiles = walk(assetDir);
const items = absFiles
  .map((abs) => {
    const publicPath = toPublicPath(abs);
    const filename = path.basename(abs);
    const year = inferYearFromPath(publicPath);
    const dateFromName = parseDateFromFilename(filename);
    const stat = fs.statSync(abs);
    const mtime = new Date(stat.mtimeMs);
    const mtimeDate = `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(mtime.getDate()).padStart(2, "0")}`;

    const date = dateFromName ?? (year ? `${year}-01-01` : mtimeDate);
    const title = titleFromFilename(filename);

    return {
      id: slugFromPublicPath(publicPath),
      slug: slugFromPublicPath(publicPath),
      kind: kindFromPath(publicPath),
      title,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      year: year ?? Number(date.slice(0, 4)),
      date,
      dimensionsCm: { width: 0, height: 0 },
      image: publicPath,
      images: [publicPath],
    };
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const output = {
  generatedAt: new Date().toISOString(),
  items,
  // you can tweak these manually after generation
  featured: {
    homeHero: items.find((i) => i.kind === "cover")?.image ?? items[0]?.image ?? null,
    homeCarousel: items
      .filter((i) => i.kind !== "cover")
      .slice(0, 5)
      .map((i) => i.image),
  },
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`Wrote ${outPath}`);
console.log(`Items: ${items.length}`);
