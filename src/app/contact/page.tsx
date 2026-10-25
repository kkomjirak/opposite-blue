'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Copy, Send } from 'lucide-react';
import { INQUIRY_EMAIL, INQUIRY_NATIVE_URL, InquiryError, submitInquiry } from '@/lib/inquiry';

const serviceGroups = [
  { title: '웹 · 커머스', options: ['웹사이트 신규 제작', '쇼핑몰 구축 (카페24/고도몰)', '웹사이트 리뉴얼 & 고도화'] },
  { title: 'AI 서비스 환경', options: ['AI 서비스 환경 구축 (LLM/에이전트)'] },
  { title: '크리에이티브 · 콘텐츠', options: ['상세페이지 & 배너 디자인', '브랜딩 & 인쇄물 디자인'] },
];
const budgets = ['협의 필요', '300만원 미만', '300만원 ~ 1,000만원', '1,000만원 ~ 3,000만원', '3,000만원 이상'];
const timelines = ['일정 미정 / 협의', '1개월 이내 (급행)', '2~3개월 이내', '3개월 이후'];
const initialData = { name: '', email: '', company: '', phone: '', services: [] as string[], budget: budgets[0], timeline: timelines[0], message: '' };
const inputStyle = 'w-full min-h-11 rounded-lg border border-neutral-400 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-600 caret-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue';
const choiceStyle = 'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 has-checked:border-brand-blue has-checked:bg-brand-iceberg/15 hover:border-brand-blue';
const buttonStyle = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60';

export default function ContactPage() {
  const [formData, setFormData] = useState(initialData);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<InquiryError | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const submittingRef = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitError || submitted) feedbackRef.current?.focus();
  }, [submitError, submitted]);

  useEffect(() => {
    if (copyStatus === 'failed') {
      manualCopyRef.current?.focus();
      manualCopyRef.current?.select();
    }
  }, [copyStatus]);

  const generateMailtoBody = () => `[Opposite Blue 프로젝트 견적 문의]\n\n담당자명: ${formData.name}\n회사 / 브랜드명: ${formData.company || '미기재'}\n이메일: ${formData.email}\n연락처: ${formData.phone || '미기재'}\n요청 서비스: ${formData.services.join(', ') || '선택 없음'}\n예상 예산: ${formData.budget}\n희망 일정: ${formData.timeline}\n\n프로젝트 상세 내용:\n${formData.message}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter instanceof HTMLButtonElement && submitter.dataset.native === 'true') {
      // Only this explicit, validated user action may leave the AJAX path.
      if (submitError?.kind === 'network' && consent && !submittingRef.current && !submitted) return;
      event.preventDefault();
      return;
    }
    event.preventDefault();
    if (submittingRef.current || submitted || !event.currentTarget.reportValidity()) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitInquiry({
        _subject: `[Opposite Blue 견적 문의] ${formData.name}님`,
        _template: 'table', _captcha: 'false', _replyto: formData.email,
        담당자명: formData.name, 이메일: formData.email,
        연락처: formData.phone || '미기재', '회사 / 브랜드명': formData.company || '미기재',
        '요청 서비스': formData.services.join(', ') || '선택 없음',
        '예상 예산': formData.budget, '희망 일정': formData.timeline, '프로젝트 상세 내용': formData.message,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof InquiryError ? error : new InquiryError('network', '브라우저에서 전송 결과를 확인하지 못했습니다. 이메일로 문의해 주세요.'));
    } finally { submittingRef.current = false; setIsSubmitting(false); }
  };

  const copyToClipboard = async () => {
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(generateMailtoBody());
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 selection:bg-brand-yellow selection:text-neutral-950 md:px-12 md:py-16">
      <header className="mb-8 max-w-3xl border-b border-neutral-200 pb-6 md:mb-10">
        <h1 className="text-3xl font-medium leading-tight tracking-tight text-neutral-900 md:text-5xl">프로젝트를 들려주세요.</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-600">웹사이트, 커머스, AI 서비스에 대한 견적과 상담을 신청해 주세요. 아직 정해지지 않은 내용은 비워두셔도 됩니다.</p>
      </header>
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <form onSubmit={handleSubmit} action={INQUIRY_NATIVE_URL} method="POST" target="_blank" rel="noopener noreferrer" className="min-w-0 space-y-9" aria-label="프로젝트 견적 문의" aria-busy={isSubmitting}>
          <input type="hidden" name="_subject" value={`[Opposite Blue 견적 문의] ${formData.name}님`} />
          <input type="hidden" name="_replyto" value={formData.email} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <fieldset className="space-y-5" disabled={isSubmitting || submitted}>
            <legend className="mb-4 text-lg font-semibold text-neutral-900">기본 정보</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {([
                ['name', '담당자명 / 의뢰인 성함 (필수)', 'text', 'name', '홍길동', true],
                ['email', '이메일 주소 (필수)', 'email', 'email', 'yourname@company.com', true],
                ['company', '회사명 또는 브랜드명 (선택)', 'text', 'organization', '예: Opposite Blue', false],
                ['phone', '연락처 (선택)', 'tel', 'tel', '010-1234-5678', false],
              ] as const).map(([key, label, type, autoComplete, placeholder, required]) => (
                <div key={key}>
                  <label htmlFor={`inquiry-${key}`} className="mb-2 block text-sm font-medium text-neutral-900">{label}</label>
                  <input id={`inquiry-${key}`} name={key} type={type} autoComplete={autoComplete} required={required} placeholder={placeholder} value={formData[key]} onChange={event => setFormData(prev => ({ ...prev, [key]: event.target.value }))} className={inputStyle} />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset disabled={isSubmitting || submitted} className="border-t border-neutral-200 pt-6">
            <legend className="pr-3 text-lg font-semibold text-neutral-900">필요하신 서비스 (선택 · 중복 가능)</legend>
            <div className="grid gap-5 md:grid-cols-3">
              {serviceGroups.map((group, groupIndex) => (
                <fieldset key={group.title} className="min-w-0 space-y-2">
                  <legend className="mb-3 text-sm font-medium text-brand-blue">{group.title}</legend>
                  {group.options.map((service, index) => (
                    <label key={service} htmlFor={`service-${groupIndex}-${index}`} className={choiceStyle}>
                      <input id={`service-${groupIndex}-${index}`} name="services" type="checkbox" value={service} checked={formData.services.includes(service)} onChange={event => setFormData(prev => ({ ...prev, services: event.target.checked ? [...prev.services, service] : prev.services.filter(item => item !== service) }))} className="h-4 w-4 shrink-0 accent-brand-blue" />
                      <span>{service}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-7 border-t border-neutral-200 pt-6 sm:grid-cols-2">
            {([
              ['budget', '예상 예산 범위 (선택)', budgets],
              ['timeline', '희망 론칭 일정 (선택)', timelines],
            ] as const).map(([key, label, options]) => (
              <fieldset key={key} disabled={isSubmitting || submitted} className="space-y-2">
                <legend className="mb-3 text-base font-semibold text-neutral-900">{label}</legend>
                {options.map((option, index) => (
                  <label htmlFor={`${key}-${index}`} key={option} className={choiceStyle}>
                    <input type="radio" id={`${key}-${index}`} name={key} value={option} checked={formData[key] === option} onChange={() => setFormData(prev => ({ ...prev, [key]: option }))} className="h-4 w-4 shrink-0 accent-brand-blue" />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-6">
            <label htmlFor="inquiry-message" className="mb-3 block text-lg font-semibold text-neutral-900">프로젝트 세부 내용 및 참고 사이트 (필수)</label>
            <p id="message-hint" className="mb-3 text-sm leading-relaxed text-neutral-600">목적, 필요한 기능, 참고 사이트 등을 자유롭게 적어주세요. 비밀번호, 결제 정보 등 민감한 정보는 입력하지 마세요.</p>
            <textarea id="inquiry-message" name="message" required rows={5} aria-describedby="message-hint" disabled={isSubmitting || submitted} value={formData.message} onChange={event => setFormData(prev => ({ ...prev, message: event.target.value }))} className={`${inputStyle} leading-relaxed`} />
          </div>

          <div className="space-y-3 border-t border-neutral-200 pt-6 text-sm leading-relaxed text-neutral-600">
            <p id="privacy-hint">입력하신 정보는 외부 전송 서비스 FormSubmit을 통해 이메일로 전달됩니다. 문의 응대에 필요한 정보만 작성해 주세요.</p>
            <div className="flex items-start gap-3">
              <label htmlFor="inquiry-consent" className="flex min-h-11 cursor-pointer items-center gap-3 text-neutral-900">
                <input id="inquiry-consent" type="checkbox" name="privacy-consent" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={isSubmitting || submitted} aria-describedby="privacy-hint" className="h-4 w-4 shrink-0 accent-brand-blue" />
                <span>개인정보 수집·이용 및 외부 전송에 동의합니다 (필수).</span>
              </label>
            </div>
            <a href="/privacy" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">개인정보 처리방침</a>
          </div>

          <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
            <button type="submit" disabled={isSubmitting || submitted} className={`${buttonStyle} bg-brand-yellow text-neutral-950 hover:bg-brand-yellow/85`}>
              <Send aria-hidden="true" className="h-4 w-4" />{isSubmitting ? '견적 문의 전송 중...' : '견적 문의 전송하기'}
            </button>
            <button type="button" onClick={copyToClipboard} disabled={copyStatus === 'copying'} className={`${buttonStyle} border border-neutral-300 text-neutral-900 hover:bg-neutral-100`}><Copy aria-hidden="true" className="h-4 w-4" />{copyStatus === 'copying' ? '복사 중...' : '작성한 내용 텍스트 복사'}</button>
            <a href={`mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent('[Opposite Blue] 프로젝트 견적 문의')}&body=${encodeURIComponent(generateMailtoBody())}`} className={`${buttonStyle} text-brand-blue underline underline-offset-4`}>이메일 앱에서 문의 작성</a>
          </div>
          {copyStatus === 'copied' && <p role="status" aria-label="복사 상태" className="text-sm text-neutral-600">문의 내용을 복사했습니다. 이메일 본문에 붙여넣어 주세요.</p>}
          {copyStatus === 'failed' && <div className="space-y-3"><p role="alert" aria-label="복사 상태" className="text-sm text-neutral-600">자동 복사를 사용할 수 없습니다. 아래 선택된 내용을 직접 복사해 이메일로 보내주세요.</p><label htmlFor="manual-copy" className="block text-sm font-medium text-neutral-900">직접 복사할 문의 내용</label><textarea id="manual-copy" ref={manualCopyRef} readOnly value={generateMailtoBody()} rows={7} className={inputStyle} /></div>}
          {submitError && <div ref={feedbackRef} tabIndex={-1} role="alert" aria-label="문의 전송 상태" className="rounded-lg border border-red-300 bg-red-50 p-5 text-sm leading-relaxed text-red-900"><p className="mb-2 font-semibold">문의 접수를 확인하지 못했습니다.</p><p>{submitError.message}</p></div>}
          {submitError?.kind === 'network' && <div className="space-y-3 text-sm leading-relaxed text-neutral-600"><p>브라우저 요청이 차단된 경우, 아래 버튼으로 외부 FormSubmit 페이지에 직접 전송할 수 있습니다. 이미 처리된 문의라면 중복 접수될 수 있습니다. 먼저 이메일로 확인하거나 직접 전송 여부를 결정해 주세요. 결과는 새 탭에서 확인해 주세요.</p><button type="submit" data-native="true" disabled={isSubmitting || submitted} formAction={INQUIRY_NATIVE_URL} formMethod="POST" formTarget="_blank" className={`${buttonStyle} border border-brand-blue text-brand-blue hover:bg-brand-iceberg/15`}>FormSubmit 페이지에서 직접 전송 (새 탭)</button></div>}
          {submitted && (
            <div ref={feedbackRef} tabIndex={-1} role="status" aria-label="문의 접수 상태" className="space-y-3 rounded-lg border border-brand-iceberg bg-brand-iceberg/15 p-5 text-neutral-900">
              <h2 className="font-semibold">전송 서비스가 문의를 접수했습니다.</h2>
              <p className="text-sm leading-relaxed text-neutral-600">FormSubmit의 접수 응답을 확인했습니다. 실제 이메일 도착이나 담당자 확인을 보장하는 알림은 아닙니다.</p>
              <button type="button" onClick={() => {
                setSubmitted(false);
                setFormData(initialData);
                setConsent(false);
                setSubmitError(null);
                setCopyStatus('idle');
                requestAnimationFrame(() => document.getElementById('inquiry-name')?.focus());
              }} className={`${buttonStyle} border border-brand-blue text-brand-blue hover:bg-brand-iceberg/15`}>새 문의 작성하기</button>
            </div>
          )}
        </form>
        <aside className="border-t border-neutral-200 pt-6 lg:border-t-0 lg:pt-0">
          <h2 className="text-base font-semibold text-neutral-900">직접 이메일 문의</h2>
          <a href={`mailto:${INQUIRY_EMAIL}`} className="inline-flex min-h-11 items-center break-all text-sm text-brand-blue underline underline-offset-4">{INQUIRY_EMAIL}</a>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">영업일 기준 24시간 이내 회신을 목표로 합니다. 문의 내용과 업무 상황에 따라 시간이 더 걸릴 수 있습니다.</p>
        </aside>
      </div>
    </div>
  );
}
