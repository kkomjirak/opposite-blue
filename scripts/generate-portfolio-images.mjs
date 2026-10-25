import { createHash } from 'node:crypto';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Change the revision when processing semantics change; encoder version is hashed too.
const settings = { revision: 1, widths: [400, 800, 1200], quality: 84, effort: 6, sharp: sharp.versions.sharp, webp: sharp.versions.webp };
const defaultRoot = fileURLToPath(new URL('../', import.meta.url));

/** Generate only dataset-referenced images. Existing files and originals are never deleted. */
export async function generatePortfolioImages({ root = defaultRoot, dataset } = {}) {
  dataset ??= JSON.parse(await readFile(path.join(root, 'src/data/portfolio_data.json'), 'utf8'));
  const sources = [...new Set(dataset.flatMap((item) => item.images.map((image) => image.relative_path)))].sort();
  const outputDirectory = path.join(root, 'public/portfolio-optimized');
  await mkdir(outputDirectory, { recursive: true });
  const manifest = {};
  const byContent = new Map();
  const summary = { sourcePaths: sources.length, uniqueSources: 0, animated: 0, derivatives: 0, originalBytes: 0, derivativeBytes: 0, thumbnailBytes: 0, heroBytes: 0 };

  for (const relativePath of sources) {
    if (!relativePath.startsWith('images/') || relativePath.split('/').some((part) => part === '..' || part === '.')) {
      throw new Error(`Invalid portfolio image path: ${relativePath}`);
    }
    // Reading through public/portfolio/images intentionally follows the preserved source symlink.
    const source = await readFile(path.join(root, 'public/portfolio', relativePath));
    const hash = createHash('sha256').update(source).update(JSON.stringify(settings)).digest('hex').slice(0, 24);
    let entry = byContent.get(hash);
    if (!entry) {
      const metadata = await sharp(source).metadata();
      const width = metadata.autoOrient?.width ?? metadata.width;
      const height = metadata.autoOrient?.height ?? metadata.pageHeight ?? metadata.height;
      if (!width || !height) throw new Error(`Missing image dimensions: ${relativePath}`);
      const animated = (metadata.pages ?? 1) > 1;
      entry = { width, height, bytes: source.length, ...(animated ? { animated: true } : {}), variants: [] };
      summary.uniqueSources += 1;
      summary.originalBytes += source.length;
      if (animated) {
        // Do not flatten GIFs or generate expensive duplicate animations. The original remains playable.
        summary.animated += 1;
        summary.thumbnailBytes += source.length;
        summary.heroBytes += source.length;
      } else {
        const widths = [...new Set(settings.widths.map((size) => Math.min(size, width)))];
        for (const targetWidth of widths) {
          const src = `/portfolio-optimized/${hash}-${targetWidth}.webp`;
          const output = path.join(root, 'public', src);
          try {
            await access(output);
          } catch {
            await sharp(source).rotate().resize({ width: targetWidth, withoutEnlargement: true })
              .webp({ quality: settings.quality, effort: settings.effort }).toFile(output);
          }
          const bytes = (await stat(output)).size;
          entry.variants.push({ width: targetWidth, src, bytes });
          summary.derivatives += 1;
          summary.derivativeBytes += bytes;
        }
        summary.thumbnailBytes += entry.variants[0].bytes;
        summary.heroBytes += entry.variants.at(-1).bytes;
      }
      byContent.set(hash, entry);
    }
    manifest[`/portfolio/${relativePath}`] = entry;
  }

  const manifestPath = path.join(root, 'src/data/portfolio_images.json');
  await mkdir(path.dirname(manifestPath), { recursive: true });
  // No timestamps or absolute paths: repeated builds produce byte-identical manifests and URLs.
  await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`);
  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await generatePortfolioImages(), null, 2));
}
