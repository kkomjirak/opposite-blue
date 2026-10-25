export const INQUIRY_EMAIL = 'contact@oppositeblue.co.kr';
export const INQUIRY_AJAX_URL = `https://formsubmit.co/ajax/${INQUIRY_EMAIL}`;
export const INQUIRY_NATIVE_URL = `https://formsubmit.co/${INQUIRY_EMAIL}`;

export type InquiryFailure = 'network' | 'timeout' | 'http' | 'response' | 'rejected';

export class InquiryError extends Error {
  constructor(public kind: InquiryFailure, message: string, public status?: number) {
    super(message);
    this.name = 'InquiryError';
  }
}

const invalidResponseMessage = '전송 서비스의 응답 형식을 확인할 수 없습니다. 접수 여부가 불확실하므로 중복 전송 전에 이메일로 확인해 주세요.';

/** Provider acceptance is not a delivery receipt. Never retry automatically. */
export async function submitInquiry(fields: Record<string, string>) {
  // https://formsubmit.co/documentation documents a jQuery data-object POST,
  // which is URL-encoded by default. This avoids a JSON-triggered preflight;
  // it does not bypass CORS. Let the browser set the safelisted Content-Type.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(INQUIRY_AJAX_URL, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams(fields),
      credentials: 'omit',
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new InquiryError('http', `전송 서비스가 요청을 처리하지 못했습니다 (HTTP ${response.status}). 잠시 후 직접 다시 시도하거나 이메일로 문의해 주세요.`, response.status);
    }

    let result: unknown;
    try {
      result = JSON.parse(text);
    } catch {
      throw new InquiryError('response', invalidResponseMessage);
    }
    if (!result || typeof result !== 'object' || !('success' in result)) {
      throw new InquiryError('response', invalidResponseMessage);
    }
    if (result.success !== true && result.success !== 'true') {
      throw new InquiryError('rejected', '전송 서비스가 문의 접수를 승인하지 않았습니다. 입력 내용을 확인하거나 이메일로 문의해 주세요.');
    }
  } catch (error) {
    if (error instanceof InquiryError) throw error;
    if (controller.signal.aborted) {
      throw new InquiryError('timeout', '응답 대기 시간이 초과되었습니다. 접수 여부가 불확실하며 자동으로 재전송하지 않습니다. 중복 문의를 피하려면 이메일로 먼저 확인해 주세요.');
    }
    throw new InquiryError('network', '브라우저에서 전송 결과를 확인하지 못했습니다. 연결 문제 또는 브라우저의 교차 출처 요청(CORS) 차단 등이 원인일 수 있습니다. 접수 여부는 불확실하며 자동으로 재전송하지 않습니다.');
  } finally {
    clearTimeout(timeout);
  }
}
