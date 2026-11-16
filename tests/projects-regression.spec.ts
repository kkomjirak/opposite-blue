import { expect, test } from '@playwright/test';

test('cold direct Projects navigation preserves the resolved index footprint', async ({ page }) => {
  await page.addInitScript(() => {
    const shifts: Array<{ value?: number; hadRecentInput?: boolean }> = [];
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        shifts.push(entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean });
      }
    }).observe({ type: 'layout-shift', buffered: true });

    Object.defineProperty(window, '__projectsColdCls', {
      value: () => shifts.reduce((total, shift) => total + (shift.hadRecentInput ? 0 : (shift.value ?? 0)), 0),
    });
  });

  await page.goto('/projects', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1, name: /A curated collection/ })).toBeVisible();
  await page.waitForTimeout(250);

  const cls = await page.evaluate(() => (window as unknown as Window & { __projectsColdCls: () => number }).__projectsColdCls());
  expect(cls).toBe(0);
});

test('normal-motion project hover leaves category imagery unscaled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const category = page.getByRole('link', { name: /Websites Preview/ });
  const image = category.locator('img');
  await expect(image).toBeVisible();
  const before = await image.boundingBox();
  if (!before) throw new Error('Category image did not receive a layout box.');

  await category.hover();
  await page.waitForTimeout(250);

  const after = await image.boundingBox();
  await expect(image).toHaveCSS('scale', 'none');
  await expect(image).toHaveCSS('transform', 'none');
  expect(after?.width).toBeCloseTo(before.width, 3);
  expect(after?.height).toBeCloseTo(before.height, 3);
});

test('home preserves the approved information paragraphs and nine service facts', async ({ page }) => {
  await page.goto('/');
  for (const text of [
    '고성능 웹 환경',
    'AI 기반의 자동화 생태계',
    '카페24, 고도몰, 그누보드 커스텀',
    '모바일 반응형 & 웹 표준 최적화',
    'LLM / RAG 검색 파이프라인',
    'MCP 및 외부 API 연동 인프라',
    '초고해상도 커머스 상세페이지',
    '시즌/이벤트 모션 배너 (GIF)',
    '최대 6,600px+',
  ]) {
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  }
});
