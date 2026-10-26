import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const projectsSource = () => readFileSync('src/app/projects/page.tsx', 'utf8');

test('design filters expose selection, retain keyboard focus and meet touch targets', async ({ page }) => {
  await page.goto('/projects?cat=design');
  const all = page.getByRole('button', { name: /^전체/ });
  const print = page.getByRole('button', { name: /^인쇄물 디자인/ });
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await print.focus();
  await page.keyboard.press('Enter');
  await expect(print).toHaveAttribute('aria-pressed', 'true');
  await expect(all).toHaveAttribute('aria-pressed', 'false');
  await expect(print).toBeFocused();
  for (const control of await page.getByRole('main').getByRole('button').all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('projects use brand tokens, readable metadata and the optimized portfolio image component', () => {
  const source = projectsSource();
  expect(source).not.toMatch(/#[a-f\d]{3,8}\b/i);
  expect(source).not.toContain('text-neutral-400');
  expect(source).toContain("from '@/components/PortfolioImage'");
});

test('category cards are native keyboard-operable links', async ({ page }) => {
  await page.goto('/projects');
  const websites = page.getByRole('link', { name: /Websites Preview/ });
  await expect(websites).toHaveAttribute('href', '/projects?cat=websites');
  await websites.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/cat=websites/);
  await expect(page.getByRole('heading', { name: /^Websites \d+ Projects$/, level: 2 })).toBeVisible();
  await page.getByRole('button', { name: 'Design (22) →' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/cat=design/);
  await expect(page.getByRole('heading', { name: /Design Works/, level: 2 })).toBeVisible();
});

test('project links open a named native dialog and Escape restores list focus and URL', async ({ page }) => {
  await page.goto('/projects?cat=websites');
  const project = page.locator('a[href="/projects?cat=websites&project=32"]');
  await expect(project).toHaveCount(1);
  await project.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/cat=websites&project=32/);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-labelledby', 'project-dialog-title');
  await expect(dialog).toHaveJSProperty('tagName', 'DIALOG');
  await expect(dialog.getByRole('button', { name: '닫기', exact: true }).first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/projects\?cat=websites$/);
  await expect(project).toBeFocused();
  await expect(page.locator('a a, a button')).toHaveCount(0);
});

test('deep-linked gallery has named current thumbnails and touch-sized controls', async ({ page }) => {
  await page.goto('/projects?cat=design&project=27');
  const dialog = page.getByRole('dialog', { name: 'LG전자 정수기 브로셔 디자인' });
  await expect(dialog).toBeVisible();
  const first = dialog.getByRole('button', { name: '이미지 1 보기', exact: true });
  const second = dialog.getByRole('button', { name: '이미지 2 보기', exact: true });
  await expect(first).toHaveAttribute('aria-current', 'true');
  await second.click();
  await expect(second).toHaveAttribute('aria-current', 'true');
  await expect(first).toHaveAttribute('aria-current', 'false');
  await expect(dialog.getByText('이미지 2 / 7', { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '다음 이미지' }).click();
  await expect(dialog.getByText('이미지 3 / 7', { exact: true })).toBeVisible();
  for (const control of await dialog.getByRole('button').all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await dialog.getByRole('button', { name: '닫기', exact: true }).first().click();
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/projects\?cat=design$/);
});

test('forward-reopened dialogs close without replacing the shareable history entry', async ({ page }) => {
  await page.goto('/projects?cat=websites');
  await page.locator('a[href="/projects?cat=websites&project=32"]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/cat=websites&project=32/);
});

test('shareable project URLs survive refresh and direct-close without extra history entries', async ({ page }) => {
  await page.goto('/projects?cat=websites&project=32');
  const dialog = page.getByRole('dialog', { name: '브랜드 의류 쇼핑몰' });
  await expect(dialog).toBeVisible();
  await page.reload();
  await expect(dialog).toBeVisible();
  const historyLength = await page.evaluate(() => history.length);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/projects\?cat=websites$/);
  await expect(page.getByRole('heading', { level: 2, name: /^Websites/ })).toBeFocused();
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
});

test('invalid, partial and category-mismatched IDs never open a false project', async ({ page }) => {
  for (const query of ['cat=websites&project=32abc', 'cat=websites&project=032', 'cat=websites&project=32.0', 'cat=websites&project=-32', 'cat=websites&project=9999', 'cat=design&project=32', 'cat=unknown&project=32', 'project=32']) {
    await page.goto(`/projects?${query}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
});

test('list scroll and filter survive a modal, Back, Forward and backdrop close', async ({ page }) => {
  await page.goto('/projects?cat=design');
  await page.getByRole('button', { name: /^배너 디자인/ }).click();
  const card = page.locator('a[href="/projects?cat=design&project=13"]');
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(0);
  const historyLength = await page.evaluate(() => history.length);
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.goBack();
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
  await expect(page.getByRole('button', { name: /^배너 디자인/ })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
  await page.goForward();
  await expect(dialog).toBeVisible();
  await page.mouse.click(2, 2);
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
  expect(await page.evaluate(() => history.length)).toBe(historyLength + 1);
});

test('dialog traps keyboard focus and fits a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/projects?cat=design&project=27');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: '닫기', exact: true });
  await close.first().focus();
  // Native dialogs may let Tab visit browser chrome; background page controls
  // must remain inert rather than being captured by a custom focus trap.
  for (let step = 0; step < 15; step++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((element) =>
      document.activeElement === document.body || element.contains(document.activeElement)
    )).toBe(true);
  }
  await close.first().focus();
  await expect(close.first()).toBeFocused();
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(360);
  expect(bounds?.height).toBeLessThanOrEqual(740);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('closed clothing-store project is marked without an active external link', async ({ page }) => {
  await page.goto('/projects?cat=websites');
  const link = page.getByRole('link', { name: '브랜드 의류 쇼핑몰', exact: true });
  const card = page.locator('div.group').filter({ has: link });
  await expect(card.getByText('운영 중단', { exact: true })).toBeVisible();
  await expect(page.locator('a[href="https://cheiser.kr/"]')).toHaveCount(0);
  await link.click();
  const dialog = page.getByRole('dialog', { name: '브랜드 의류 쇼핑몰' });
  await expect(dialog.getByText('운영 중단', { exact: true })).toBeVisible();
  await expect(dialog.locator('a[href="https://cheiser.kr/"]')).toHaveCount(0);
  await expect(dialog.locator('img')).toBeVisible();
  await expect(dialog.getByText('CMS : 카페24', { exact: true })).toBeVisible();
  await page.goto('/');
  const featured = page.getByRole('link').filter({ has: page.getByRole('heading', { name: '브랜드 의류 쇼핑몰', exact: true }) });
  await expect(featured.getByText('운영 중단', { exact: true })).toBeVisible();
});

test('new design-company portfolio item is listed with its stack and live link', async ({ page }) => {
  await page.goto('/projects?cat=websites');
  const project = page.getByRole('link', { name: '디자인회사', exact: true });
  await expect(project).toBeVisible();
  await project.click();
  const dialog = page.getByRole('dialog', { name: '디자인회사' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Framework: Next.js 16 (App Router, Turbopack)');
  await expect(dialog).toContainText('Form Service: FormSubmit');
  await expect(dialog.getByRole('link', { name: '방문하기' })).toHaveAttribute('href', 'https://jid.kr/');
});

test('live site links stay separate from detail links and have 44px targets', async ({ page }) => {
  await page.goto('/projects?cat=websites');
  const site = page.getByRole('main').locator('a[href="http://superbshop.co.kr/"]');
  await expect(site).toHaveAttribute('target', '_blank');
  await expect(site.locator('a, button')).toHaveCount(0);
  expect((await site.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await page.locator('a[href="/projects?cat=websites&project=31"]').click();
  const dialogSite = page.getByRole('dialog').locator('a[href="http://superbshop.co.kr/"]');
  await expect(dialogSite).toBeVisible();
  expect((await dialogSite.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test('reduced motion keeps the project introduction visible from first paint', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects', { waitUntil: 'domcontentloaded' });
  const intro = page.getByRole('heading', { level: 1 }).locator('..').locator('..');
  const style = await intro.evaluate((element) => ({
    opacity: getComputedStyle(element).opacity,
    transform: getComputedStyle(element).transform,
  }));
  expect(style).toEqual({ opacity: '1', transform: 'none' });
  const category = page.getByRole('link', { name: /Websites Preview/ });
  await category.hover();
  await expect(category.locator('img')).toHaveCSS('transform', 'none');
});
