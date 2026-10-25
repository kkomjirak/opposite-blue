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

test('home featured work links directly to the selected project', async ({ page }) => {
  await page.goto('/');
  const featured = page.getByRole('link').filter({ has: page.getByRole('heading', { name: '브랜드 의류 쇼핑몰' }) });
  await expect(featured).toHaveAttribute('href', '/projects?cat=websites&project=32');
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

for (const width of [320, 390, 768, 1440]) {
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
