'use client';

import { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, Copy, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    budget: '협의 필요',
    timeline: '2~3개월 이내',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const serviceOptions = [
    '웹사이트 신규 제작',
    '쇼핑몰 구축 (카페24/고도몰)',
    'AI 서비스 환경 구축 (LLM/에이전트)',
    '웹사이트 리뉴얼 & 고도화',
    '상세페이지 & 배너 디자인',
    '브랜딩 & 인쇄물 디자인',
  ];

  const budgetOptions = [
    '협의 필요',
    '300만원 미만',
    '300만원 ~ 1,000만원',
    '1,000만원 ~ 3,000만원',
    '3,000만원 이상',
  ];

  const timelineOptions = ['1개월 이내 (급행)', '2~3개월 이내', '3개월 이후', '일정 미정 / 협의'];

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const generateMailtoBody = () => {
    return `[Opposite Blue 프로젝트 견적 문의]\n\n` +
      `■ 담당자명: ${formData.name}\n` +
      `■ 회사/브랜드명: ${formData.company || '미기재'}\n` +
      `■ 이메일: ${formData.email}\n` +
      `■ 연락처: ${formData.phone || '미기재'}\n` +
      `■ 요청 서비스: ${formData.services.length > 0 ? formData.services.join(', ') : '선택 없음'}\n` +
      `■ 예상 예산: ${formData.budget}\n` +
      `■ 희망 일정: ${formData.timeline}\n\n` +
      `■ 프로젝트 상세 내용:\n${formData.message}\n`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(`[Opposite Blue 견적 문의] ${formData.company || formData.name}`);
    const mailtoBody = encodeURIComponent(generateMailtoBody());
    const mailtoUrl = `mailto:contact@oppositeblue.co.kr?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMailtoBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Category / Sub-heading */}
      <div className="mb-6">
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
          03 / Contact & Estimate
        </span>
      </div>

      {/* Editorial Headline */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-gray-100">
        <div className="md:col-span-8">
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-tight">
            Tell us about your project.{' '}
            <span className="text-neutral-400">Let’s discuss your vision and build a solution.</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-500 max-w-2xl leading-relaxed">
            웹사이트 제작, 커머스 솔루션, AI 서비스 인프라 도입에 대한 견적 및 컨설팅을 신청해주세요. 확인 후 신속하게 회신드리겠습니다.
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col justify-end space-y-4">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>직접 이메일 문의</span>
            </div>
            <a
              href="mailto:contact@oppositeblue.co.kr"
              className="text-sm font-medium text-neutral-700 hover:text-neutral-950 underline underline-offset-4 break-all block"
            >
              contact@oppositeblue.co.kr
            </a>
            <p className="text-xs text-neutral-400 leading-relaxed">
              영업일 기준 24시간 이내에 담당자가 상세한 견적 및 제안서를 회신드립니다.
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="py-12 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Contact Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                1
              </span>
              <span>기본 정보</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  담당자명 / 의뢰인 성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  회사명 또는 브랜드명
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="예: Opposite Blue"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">연락처</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Services Requested */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                2
              </span>
              <span>필요하신 서비스 (중복 선택 가능)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {serviceOptions.map((service) => {
                const selected = formData.services.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      selected
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-neutral-700 hover:border-gray-300 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{service}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                        selected
                          ? 'border-white bg-white text-neutral-900'
                          : 'border-gray-300 bg-transparent'
                      }`}
                    >
                      {selected && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Budget & Timeline */}
          <div className="space-y-6 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                3
              </span>
              <span>예산 및 희망 일정</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-3">예상 예산 범위</label>
                <div className="flex flex-wrap gap-2">
                  {budgetOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: b })}
                      className={`px-3.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        formData.budget === b
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-3">희망 론칭 일정</label>
                <div className="flex flex-wrap gap-2">
                  {timelineOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: t })}
                      className={`px-3.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        formData.timeline === t
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Details & Message */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                4
              </span>
              <span>프로젝트 세부 내용 및 참고 사이트</span>
            </h2>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="제작하시려는 웹사이트의 목적, 타겟 고객, 필수 기능, 벤치마킹하는 참고 사이트 URL 등을 자유롭게 적어주세요."
              className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-sm leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-full text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>견적 의뢰 메일 작성 완료</span>
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="w-full sm:w-auto px-5 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-full text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? '견적 내용 복사완료!' : '작성한 내용 텍스트 복사'}</span>
            </button>
          </div>
        </form>

        {submitted && (
          <div className="mt-8 p-6 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-semibold text-neutral-900">메일 클라이언트가 실행되었습니다.</h4>
              <p className="text-neutral-600 leading-relaxed text-xs">
                만약 메일 프로그램이 자동으로 열리지 않았다면, 위의 <strong>[작성한 내용 텍스트 복사]</strong> 버튼을 눌러 <strong>contact@oppositeblue.co.kr</strong> 으로 직접 전송해주시면 신속히 답변해 드리겠습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
