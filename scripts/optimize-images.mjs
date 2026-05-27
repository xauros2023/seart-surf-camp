#!/usr/bin/env node
/**
 * Optimize PNG/JPG images in /public/images to WebP.
 *
 * - Reads every .png / .jpg / .jpeg in public/images
 * - Writes a .webp companion next to it (quality 80, effort 5)
 * - Skips when .webp already exists and is newer than the source
 *
 * Run after dropping new images:
 *   npm run images:optimize
 *
 * The PNGs are kept as fallback / admin upload source of truth.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, "..", "public", "images");

const VALID_INPUTS = new Set([".png", ".jpg", ".jpeg"]);

async function isStale(sourcePath, webpPath) {
  try {
    const [sourceStat, webpStat] = await Promise.all([fs.stat(sourcePath), fs.stat(webpPath)]);
    return sourceStat.mtimeMs > webpStat.mtimeMs;
  } catch {
    return true; // .webp doesn't exist yet
  }
}

async function main() {
  const entries = await fs.readdir(imagesDir);
  const sources = entries.filter((name) => VALID_INPUTS.has(path.extname(name).toLowerCase()));

  if (sources.length === 0) {
    console.log("No PNG/JPG found in public/images — nothing to do.");
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const fileName of sources) {
    const sourcePath = path.join(imagesDir, fileName);
    const webpName = `${path.parse(fileName).name}.webp`;
    const webpPath = path.join(imagesDir, webpName);

    if (!(await isStale(sourcePath, webpPath))) {
      skipped++;
      continue;
    }

    const sourceBytes = (await fs.stat(sourcePath)).size;
    await sharp(sourcePath).webp({ quality: 80, effort: 5 }).toFile(webpPath);
    const webpBytes = (await fs.stat(webpPath)).size;
    const savings = (((sourceBytes - webpBytes) / sourceBytes) * 100).toFixed(1);
    console.log(`✓ ${fileName} → ${webpName}  (${(sourceBytes / 1024).toFixed(0)}KB → ${(webpBytes / 1024).toFixed(0)}KB, -${savings}%)`);
    converted++;
  }

  console.log(`\nDone. ${converted} converted, ${skipped} up-to-date.`);
}

main().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exitCode = 1;
});
