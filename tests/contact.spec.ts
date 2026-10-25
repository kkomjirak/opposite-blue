import { expect, test, type Page } from '@playwright/test';

const provider = 'https://formsubmit.co/ajax/contact@oppositeblue.co.kr';

async function fillInquiry(page: Page) {
  // Static HTML can precede React hydration on a shared compiling dev server.
  await page.waitForFunction(() => {
    const form = document.querySelector('form');
    return form && Object.keys(form).some(key => key.startsWith('__reactProps$'));
  });
  await page.getByPlaceholder('홍길동').fill('테스트 담당자');
  await page.getByPlaceholder('yourname@company.com').fill('test@example.com');
  await page.locator('textarea').first().fill('자동화 테스트 초안 — 실제 전송하지 않습니다.');
  const consent = page.getByRole('checkbox', { name: /개인정보/ });
  if (await consent.count()) await consent.check();
}

test.beforeEach(async ({ page }) => {
  // Fail closed: no test can send a real contact message, including native fallback.
  await page.route('https://formsubmit.co/**', route => route.abort());
  await page.goto('/contact');
});

test('mobile form exposes associated native controls, consent, and the first field above the fold', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');
  const name = page.getByRole('textbox', { name: /담당자명/ });
  await expect(name).toBeVisible();
  const box = await name.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(844);
  await expect(name).toHaveAttribute('autocomplete', 'name');
  await expect(name).toHaveCSS('font-size', '16px');
  await expect(page.getByRole('textbox', { name: '이메일 주소 (필수)' })).toHaveAttribute('autocomplete', 'email');
  await expect(page.getByRole('group', { name: '필요하신 서비스 (선택 · 중복 가능)' }).getByRole('checkbox')).toHaveCount(6);
  for (const area of ['웹 · 커머스', 'AI 서비스 환경', '크리에이티브 · 콘텐츠']) await expect(page.getByRole('group', { name: area, exact: true })).toBeVisible();
  await expect(page.getByRole('radio', { name: '일정 미정 / 협의' })).toBeChecked();
  await expect(page.getByRole('radio', { name: '협의 필요', exact: true })).toBeChecked();
  await expect(page.getByRole('checkbox', { name: /개인정보/ })).not.toBeChecked();
  await expect(page.getByRole('link', { name: '개인정보 처리방침', exact: true })).toHaveAttribute('href', '/privacy');
  for (const field of ['회사명 또는 브랜드명 (선택)', '연락처 (선택)']) await expect(page.getByRole('textbox', { name: field, exact: true })).not.toHaveAttribute('required');
  await expect(page.getByText(/FormSubmit을 통해/)).toBeVisible();
  await expect(page.getByText(/민감한 정보/)).toBeVisible();
  await expect(page.getByRole('button', { name: '견적 문의 전송하기' })).toHaveCSS('min-height', '44px');
});

test('network failure is uncertain, focused, and never automatically retried', async ({ page }) => {
  let calls = 0;
  await page.route(provider, route => { calls++; return route.abort('failed'); });
  await fillInquiry(page);
  await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
  const alert = page.getByRole('alert', { name: '문의 전송 상태' });
  await expect(alert).toContainText('브라우저에서 전송 결과를 확인하지 못했습니다');
  await expect(alert).toContainText('CORS');
  await expect(alert).toBeFocused();
  await expect(page.getByPlaceholder('홍길동')).toHaveValue('테스트 담당자');
  expect(calls).toBe(1);
});

test('stalled requests abort after 15 seconds with input retained and no resend', async ({ page }) => {
  let calls = 0;
  await page.route(provider, () => { calls++; });
  await fillInquiry(page);
  await page.clock.install();
  await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
  await expect.poll(() => calls).toBe(1);
  await page.clock.fastForward(15_100);
  const alert = page.getByRole('alert', { name: '문의 전송 상태' });
  await expect(alert).toContainText('응답 대기 시간이 초과되었습니다');
  await expect(alert).toBeFocused();
  await expect(page.locator('textarea').first()).toHaveValue('자동화 테스트 초안 — 실제 전송하지 않습니다.');
  await expect(page.getByRole('button', { name: '견적 문의 전송하기' })).toBeEnabled();
  expect(calls).toBe(1);
});

for (const success of [true, 'true']) {
  test(`provider acceptance (${typeof success}) uses simple URL-encoded POST and disables duplicates`, async ({ page }) => {
    let calls = 0;
    await page.route(provider, async route => {
      calls++;
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(request.headers()['accept']).toBe('application/json');
      expect(request.headers()['content-type']).toMatch(/^application\/x-www-form-urlencoded/);
      const body = new URLSearchParams(request.postData()!);
      expect(body.get('_replyto')).toBe('test@example.com');
      expect(body.get('희망 일정')).toBe('일정 미정 / 협의');
      expect(body.get('요청 서비스')).toBe('웹사이트 신규 제작, 브랜딩 & 인쇄물 디자인');
      await route.fulfill({ json: { success } });
    });
    await fillInquiry(page);
    await page.getByRole('checkbox', { name: '웹사이트 신규 제작', exact: true }).check();
    await page.getByRole('checkbox', { name: '브랜딩 & 인쇄물 디자인', exact: true }).check();
    await page.locator('form').evaluate(form => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    const status = page.getByRole('status', { name: '문의 접수 상태' });
    await expect(status).toContainText('전송 서비스가 문의를 접수했습니다');
    await expect(status).toBeFocused();
    await expect(status).toContainText('실제 이메일 도착');
    await expect(page.getByRole('button', { name: '견적 문의 전송하기' })).toBeDisabled();
    expect(calls).toBe(1);
    await page.getByRole('button', { name: '새 문의 작성하기' }).click();
    await expect(page.getByPlaceholder('홍길동')).toBeFocused();
    await expect(page.getByPlaceholder('홍길동')).toHaveValue('');
    await expect(page.getByRole('checkbox', { name: /개인정보/ })).not.toBeChecked();
    await expect(page.getByRole('radio', { name: '일정 미정 / 협의' })).toBeChecked();
  });
}

for (const sample of [
  { label: 'rejection', status: 200, body: '{"success":"false","message":"<b>untrusted provider</b>"}', expected: '전송 서비스가 문의 접수를 승인하지 않았습니다' },
  { label: 'rate limit', status: 429, body: '<html>Rate limited</html>', expected: 'HTTP 429' },
  { label: 'malformed JSON', status: 200, body: '{broken', expected: '응답 형식을 확인할 수 없습니다' },
  { label: 'unknown JSON', status: 200, body: '{"accepted":true}', expected: '응답 형식을 확인할 수 없습니다' },
]) {
  test(`${sample.label} is classified without losing input`, async ({ page }) => {
    await page.route(provider, route => route.fulfill({ status: sample.status, contentType: 'application/json', body: sample.body }));
    await fillInquiry(page);
    await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
    await expect(page.getByRole('alert', { name: '문의 전송 상태' })).toContainText(sample.expected);
    await expect(page.getByPlaceholder('yourname@company.com')).toHaveValue('test@example.com');
    await expect(page.getByText('untrusted provider')).toHaveCount(0);
  });
}

test('clipboard success is announced only after the write resolves', async ({ page }) => {
  await fillInquiry(page);
  await page.clock.install();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (text: string) => new Promise<void>(resolve => {
      document.documentElement.dataset.copiedDraft = text;
      setTimeout(resolve, 1000);
    }) } });
  });
  await page.getByRole('button', { name: '작성한 내용 텍스트 복사' }).click();
  await expect(page.getByText('견적 내용 복사완료!', { exact: true })).toHaveCount(0);
  await page.clock.fastForward(1100);
  await expect(page.getByRole('status', { name: '복사 상태' })).toContainText('복사했습니다');
  const copied = await page.locator('html').getAttribute('data-copied-draft');
  expect(copied).toContain('테스트 담당자');
  expect(copied).toContain('일정 미정 / 협의');
});

test('clipboard denial exposes a focused manually selectable draft and a mailto link', async ({ page }) => {
  await fillInquiry(page);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) } }));
  await page.getByRole('button', { name: '작성한 내용 텍스트 복사' }).click();
  await expect(page.getByRole('alert', { name: '복사 상태' })).toContainText('자동 복사를 사용할 수 없습니다');
  const draft = page.getByRole('textbox', { name: '직접 복사할 문의 내용' });
  await expect(draft).toBeFocused();
  await expect(draft).toHaveAttribute('readonly');
  await expect(draft).toContainText('자동화 테스트 초안');
  const selected = await draft.evaluate(element => (element as HTMLTextAreaElement).selectionEnd - (element as HTMLTextAreaElement).selectionStart);
  expect(selected).toBeGreaterThan(0);
  const mailto = page.getByRole('link', { name: '이메일 앱에서 문의 작성' });
  const href = await mailto.getAttribute('href');
  expect(href).toContain('mailto:contact@oppositeblue.co.kr?');
  expect(decodeURIComponent(href!)).toContain('테스트 담당자');
});

test('native fallback requires a deliberate click, posts in a new tab, and retains the original draft', async ({ page, context }) => {
  let nativeCalls = 0;
  await context.route('https://formsubmit.co/**', async route => {
    const request = route.request();
    expect(request.url()).toBe('https://formsubmit.co/contact@oppositeblue.co.kr');
    expect(request.method()).toBe('POST');
    const payload = new URLSearchParams(request.postData()!);
    expect(payload.get('name')).toBe('테스트 담당자');
    expect(payload.get('email')).toBe('test@example.com');
    expect(payload.get('_replyto')).toBe('test@example.com');
    expect(payload.get('privacy-consent')).toBe('on');
    nativeCalls++;
    await route.fulfill({ contentType: 'text/html', body: '<h1>Intercepted native form</h1>' });
  });
  await fillInquiry(page);
  await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
  await expect(page.getByRole('alert', { name: '문의 전송 상태' })).toBeVisible();
  expect(nativeCalls).toBe(0);
  await expect(page.getByText(/중복 접수될 수 있습니다/)).toBeVisible();
  const popupPromise = context.waitForEvent('page');
  await page.getByRole('button', { name: 'FormSubmit 페이지에서 직접 전송 (새 탭)' }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole('heading')).toHaveText('Intercepted native form');
  await expect(page.getByPlaceholder('홍길동')).toHaveValue('테스트 담당자');
  await expect(page.getByRole('status', { name: '문의 접수 상태' })).toHaveCount(0);
  expect(nativeCalls).toBe(1);
  await popup.close();
});

test('privacy consent is required before any request', async ({ page }) => {
  let calls = 0;
  await page.route(provider, route => { calls++; return route.abort(); });
  await fillInquiry(page);
  await page.getByRole('checkbox', { name: /개인정보/ }).uncheck();
  await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
  await expect(page.getByRole('checkbox', { name: /개인정보/ })).toBeFocused();
  expect(calls).toBe(0);
});

test('HTML provider responses are distinguished from network errors and retain the draft', async ({ page }) => {
  await page.route(provider, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<html>Challenge</html>' }));
  await fillInquiry(page);
  await page.getByRole('button', { name: '견적 문의 전송하기' }).click();
  await expect(page.getByRole('alert', { name: '문의 전송 상태' })).toContainText('전송 서비스의 응답 형식을 확인할 수 없습니다');
  await expect(page.getByPlaceholder('홍길동')).toHaveValue('테스트 담당자');
  await expect(page.locator('textarea').first()).toHaveValue('자동화 테스트 초안 — 실제 전송하지 않습니다.');
});
