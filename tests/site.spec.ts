import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Geist is applied and reduced motion stops the decorative pulse', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const font = await page.locator('body').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font).toMatch(/Geist/i);
  const pulse = page.locator('.animate-pulse');
  if (await pulse.count()) {
    await expect(pulse).toHaveCSS('animation-name', 'none');
  }
});

test('About explains scope, project evidence and a clear consultation process', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: '필요한 범위부터 함께 정합니다' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '문의부터 인수인계까지' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'LG전자 B2B 구축 사례 보기' })).toHaveAttribute('href', /project=30/);
});

test('home featured work uses project 33 with the approved hero copy and priority image', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Crafting high-performance websites' })).toBeVisible();
  await expect(page.getByText('Opposite Blue는 쇼핑몰과 웹사이트 구축부터 이커머스 솔루션, 최신 생성형 AI 서비스 인프라 구축까지 비즈니스의 성공적인 디지털 전환을 완벽히 구현합니다.')).toBeVisible();
  const featured = page.getByRole('link').filter({ has: page.getByRole('heading', { name: '디자인회사' }) }).first();
  await expect(featured).toHaveAttribute('href', '/projects?cat=websites&project=33');
  await expect(featured.getByText('Next.js 기반 3D 인터랙티브 웹', { exact: true })).toBeVisible();
  await expect(featured.getByText('2026년 10월', { exact: true })).toBeVisible();
  await expect(featured.locator('img[alt="디자인회사"]')).toHaveAttribute('fetchpriority', 'high');
});

test('home has no WCAG AA violations in automated checks', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
});

test('privacy and website guidance links have real destinations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('contentinfo').getByRole('link', { name: '개인정보 처리 안내' }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole('heading', { level: 1, name: '개인정보 처리 안내' })).toBeVisible();
  await page.getByRole('contentinfo').getByRole('link', { name: '사이트 이용 안내' }).click();
  await expect(page.getByRole('heading', { level: 1, name: '사이트 이용 안내' })).toBeVisible();
});

test('brand assets, favicon, and manifest are published from the static export', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
  await expect(page.locator('link[rel="icon"][href="/favicon/favicon-16x16.png"]')).toHaveAttribute('sizes', '16x16');
  await expect(page.locator('link[rel="icon"][href="/favicon/favicon-32x32.png"]')).toHaveAttribute('sizes', '32x32');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /\/apple-icon/);

  for (const asset of [
    '/favicon.ico',
    '/apple-icon.png',
    '/favicon/favicon-16x16.png',
    '/favicon/favicon-32x32.png',
    '/favicon/android-chrome-192x192.png',
    '/favicon/android-chrome-512x512.png',
    '/site.webmanifest',
  ]) {
    expect((await page.request.get(asset)).status(), asset).toBe(200);
  }

  const manifest = await (await page.request.get('/site.webmanifest')).json();
  expect(manifest.name).toBe('Opposite Blue');
  expect(manifest.short_name).toBe('Opposite Blue');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/favicon/android-chrome-192x192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/favicon/android-chrome-512x512.png', sizes: '512x512' }),
  ]));
});

test('brand symbols preserve the accessible home link and explicit layout dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const homeLink = page.getByRole('banner').getByRole('link', { name: 'Opposite Blue' });
  await expect(homeLink).toBeVisible();
  const homeBox = await homeLink.boundingBox();
  expect(homeBox!.width).toBeGreaterThanOrEqual(44);
  expect(homeBox!.height).toBeGreaterThanOrEqual(44);

  const colorMark = homeLink.locator('img[src="/brand/oppositeblue-logo.png"]');
  await expect(colorMark).toBeVisible();
  await expect(colorMark).toHaveAttribute('width', '28');
  await expect(colorMark).toHaveAttribute('height', '28');

  const grayscaleMark = page.getByRole('contentinfo').locator('img[src="/brand/oppositeblue-logo-grayscale.png"]');
  await expect(grayscaleMark).toBeVisible();
  await expect(grayscaleMark).toHaveAttribute('width', '24');
  await expect(grayscaleMark).toHaveAttribute('height', '24');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  for (const path of ['/', '/about', '/projects', '/contact', '/privacy', '/terms']) {
    test(`${path} reflows without horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width === 390) {
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
      }
    });
  }
}

test('mobile navigation exposes state, a 44px target and keyboard dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: '메뉴 열기' });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  const box = await menu.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await menu.focus();
  await menu.press('Enter');
  await expect(page.getByRole('button', { name: '메뉴 닫기' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: '모바일 메뉴' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
