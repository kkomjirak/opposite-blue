import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';

async function loadComponent() {
  const filename = path.join(root, 'src/components/PortfolioImage.tsx');
  let source;
  try { source = await readFile(filename, 'utf8'); } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  const compiled = new Module(filename);
  compiled.filename = filename;
  compiled.paths = createRequire(filename).resolve.paths('next');
  compiled._compile(result.outputText, filename);
  return compiled.exports;
}
import test from 'node:test';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const generator = await import(pathToFileURL(path.join(root, 'scripts/generate-portfolio-images.mjs')))
  .catch((error) => { if (error.code === 'ERR_MODULE_NOT_FOUND') return {}; throw error; });

test('generation deduplicates source contents, caps widths, and preserves intrinsic dimensions', async () => {
  assert.equal(typeof generator.generatePortfolioImages, 'function', 'portfolio image generator must exist');
  const fixture = await mkdtemp(path.join(tmpdir(), 'portfolio-images-'));
  await mkdir(path.join(fixture, 'public/portfolio/images'), { recursive: true });
  const png = await sharp({ create: { width: 700, height: 350, channels: 3, background: '#1264aa' } }).png().toBuffer();
  for (const filename of ['a.png', 'copy.png']) await writeFile(path.join(fixture, 'public/portfolio/images', filename), png);
  const dataset = [{ images: [{ relative_path: 'images/a.png' }, { relative_path: 'images/copy.png' }, { relative_path: 'images/a.png' }] }];
  const result = await generator.generatePortfolioImages({ root: fixture, dataset });
  const manifest = JSON.parse(await readFile(path.join(fixture, 'src/data/portfolio_images.json'), 'utf8'));
  const image = manifest['/portfolio/images/a.png'];
  assert.deepEqual([image.width, image.height], [700, 350]);
  assert.deepEqual(image.variants.map((v) => v.width), [400, 700]);
  assert.deepEqual(image, manifest['/portfolio/images/copy.png']);
  assert.equal(result.sourcePaths, 2);
  assert.equal(result.uniqueSources, 1);
  assert.equal(result.derivatives, 2);
  for (const variant of image.variants) {
    const output = path.join(fixture, 'public', variant.src);
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, Math.round(variant.width / 2));
    assert.equal((await stat(output)).size, variant.bytes);
  }
  const firstManifest = await readFile(path.join(fixture, 'src/data/portfolio_images.json'));
  const firstTimes = await Promise.all(image.variants.map((variant) => stat(path.join(fixture, 'public', variant.src)).then((file) => file.mtimeMs)));
  await generator.generatePortfolioImages({ root: fixture, dataset });
  assert.deepEqual(await readFile(path.join(fixture, 'src/data/portfolio_images.json')), firstManifest);
  assert.deepEqual(await Promise.all(image.variants.map((variant) => stat(path.join(fixture, 'public', variant.src)).then((file) => file.mtimeMs))), firstTimes);
  const changed = await sharp({ create: { width: 700, height: 350, channels: 3, background: '#ee3344' } }).png().toBuffer();
  await writeFile(path.join(fixture, 'public/portfolio/images/a.png'), changed);
  await generator.generatePortfolioImages({ root: fixture, dataset });
  const updated = JSON.parse(await readFile(path.join(fixture, 'src/data/portfolio_images.json'), 'utf8'));
  assert.notEqual(updated['/portfolio/images/a.png'].variants[0].src, image.variants[0].src);
  assert.equal(updated['/portfolio/images/copy.png'].variants[0].src, image.variants[0].src);
  assert.deepEqual(await readFile(path.join(fixture, 'public/portfolio/images/copy.png')), png);
  await assert.rejects(generator.generatePortfolioImages({ root: fixture, dataset: [{ images: [{ relative_path: 'images/../../escape.png' }] }] }), /Invalid portfolio image path/);
});

test('responsive props select existing derivatives with truthful width descriptors and preserve fill sizing', async () => {
  const component = await loadComponent();
  assert.equal(typeof component.getPortfolioImageProps, 'function', 'responsive image component must exist');
  const manifest = JSON.parse(await readFile(path.join(root, 'src/data/portfolio_images.json'), 'utf8'));
  const [src, entry] = Object.entries(manifest).find(([, image]) => image.variants.length > 1);
  const props = component.getPortfolioImageProps({ src, alt: 'Portfolio', fill: true, sizes: '(max-width: 700px) 100vw, 400px' });
  assert.equal(props.src, entry.variants.at(-1).src);
  assert.equal(props.srcSet, entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '));
  assert.equal(props.sizes, '(max-width: 700px) 100vw, 400px');
  assert.equal(props.style.position, 'absolute');
  assert.equal(props.width, undefined);
  assert.equal(props.loading, 'lazy');
  assert.equal(component.portfolioImageLoader({ src, width: 401 }), entry.variants.find((v) => v.width >= 401)?.src ?? entry.variants.at(-1).src);
  assert.equal(component.portfolioImageLoader({ src, width: 9000 }), entry.variants.at(-1).src);
  const intrinsic = component.getPortfolioImageProps({ src, alt: 'Portfolio' });
  assert.equal(intrinsic.width, entry.width);
  assert.equal(intrinsic.height, entry.height);
  assert.equal(component.getPortfolioImageProps({ src, alt: '', width: 200 }).height, Math.round(200 * entry.height / entry.width));
  const prefixed = component.getPortfolioImageProps({ src: `/opposite${src}`, alt: '', fill: true });
  assert.equal(prefixed.src, `/opposite${entry.variants.at(-1).src}`);
  assert.ok(prefixed.srcSet.split(', ').every((candidate) => candidate.startsWith('/opposite/portfolio-optimized/')));
  const full = component.getPortfolioImageProps({ src, alt: '', fullResolution: true });
  assert.equal(full.src, src);
  assert.equal(full.srcSet, undefined);
  const unknown = component.getPortfolioImageProps({ src: '/unknown.png', alt: '', width: 100, height: 50 });
  assert.equal(unknown.src, '/unknown.png');
  assert.equal(unknown.srcSet, undefined);
});

test('all dataset images have valid outputs; animated GIFs retain original bytes and frames', async () => {
  const component = await loadComponent();
  const dataset = JSON.parse(await readFile(path.join(root, 'src/data/portfolio_data.json'), 'utf8'));
  const manifest = JSON.parse(await readFile(path.join(root, 'src/data/portfolio_images.json'), 'utf8'));
  const paths = new Set(dataset.flatMap((item) => item.images.map((image) => `/portfolio/${image.relative_path}`)));
  assert.equal(Object.keys(manifest).length, paths.size);
  let animated = 0;
  for (const [src, image] of Object.entries(manifest)) {
    assert.ok(paths.has(src));
    const original = await readFile(path.join(root, 'public', src));
    const metadata = await sharp(original).metadata();
    assert.equal(original.length, image.bytes);
    if ((metadata.pages ?? 1) > 1) {
      animated++;
      assert.equal(image.animated, true);
      assert.deepEqual(image.variants, []);
      const props = component.getPortfolioImageProps({ src, alt: '' });
      assert.equal(props.src, src);
      assert.equal(props.srcSet, undefined);
      const hash = createHash('sha256').update(original).digest('hex');
      assert.equal(createHash('sha256').update(await readFile(path.join(root, 'public', props.src))).digest('hex'), hash);
    } else {
      assert.ok(image.variants.length > 0);
      for (const variant of image.variants) {
        const output = path.join(root, 'public', variant.src);
        const rendered = await sharp(output).metadata();
        assert.equal(rendered.format, 'webp');
        assert.equal(rendered.width, variant.width);
        assert.ok(rendered.width <= metadata.width);
        assert.ok(Math.abs(rendered.height - image.height * variant.width / image.width) <= 1);
        assert.equal((await stat(output)).size, variant.bytes);
      }
    }
  }
  assert.equal(animated, 2);
});
