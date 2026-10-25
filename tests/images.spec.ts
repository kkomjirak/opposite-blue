import { test, expect } from '@playwright/test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PortfolioImage from '../src/components/PortfolioImage';
import manifest from '../src/data/portfolio_images.json';

const source = '/portfolio/images/websites/32_brand-clothing-mall/01_brand-clothing-mall.png';
const entry = manifest[source];

for (const scenario of [
  { name: 'mobile thumbnail', viewport: { width: 390, height: 844 }, dpr: 1, display: 342, expected: 400 },
  { name: 'retina thumbnail', viewport: { width: 1280, height: 800 }, dpr: 2, display: 400, expected: 800 },
  { name: 'desktop detail', viewport: { width: 1440, height: 900 }, dpr: 1, display: 1000, expected: 1200 },
]) {
  test(scenario.name + ' requests only the appropriate existing static derivative', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ viewport: scenario.viewport, deviceScaleFactor: scenario.dpr });
    const page = await context.newPage();
    const requests: string[] = [];
    const failures: string[] = [];
    page.on('request', (request) => { if (request.resourceType() === 'image') requests.push(request.url()); });
    page.on('response', (response) => { if (response.status() >= 400) failures.push(response.url()); });
    const html = renderToStaticMarkup(React.createElement('div', { style: { position: 'relative', width: scenario.display, aspectRatio: '16 / 9' } },
      React.createElement(PortfolioImage, { src: source, alt: 'Brand clothing website', fill: true, sizes: `${scenario.display}px`, loading: 'eager' })));
    await page.route('**/__portfolio-image-test', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1">${html}` }));
    await page.goto(`${baseURL}/__portfolio-image-test`);
    const image = page.getByAltText('Brand clothing website');
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    expect(await image.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname)).toBe(entry.variants.find((variant) => variant.width === scenario.expected)?.src);
    expect(await image.getAttribute('srcset')).toBe(entry.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '));
    expect(requests).toHaveLength(1);
    expect(requests[0]).toContain('/portfolio-optimized/');
    expect(failures).toEqual([]);
    await context.close();
  });
}

test('original and compressed portfolio screenshots load at matching display dimensions', async ({ page, baseURL }, testInfo) => {
  const optimized = entry.variants.find((variant) => variant.width === 800)!;
  await page.route('**/__portfolio-quality-test', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><meta charset="utf-8"><style>body{margin:24px;color:#111;background:white;font:16px system-ui}main{display:grid;grid-template-columns:500px 500px;gap:24px}img{width:500px;height:auto}</style><main><section><h2>Original PNG — ${entry.bytes} bytes</h2><img alt="Original" src="${source}"></section><section><h2>800px WebP — ${optimized.bytes} bytes</h2><img alt="Optimized" src="${optimized.src}"></section></main>` }));
  await page.goto(`${baseURL}/__portfolio-quality-test`);
  for (const name of ['Original', 'Optimized']) {
    await expect.poll(() => page.getByAltText(name).evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    expect((await page.getByAltText(name).boundingBox())?.width).toBe(500);
  }
  await page.screenshot({ path: testInfo.outputPath('portfolio-quality.png'), fullPage: true });
});
