import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About us — Opposite Blue',
  description: 'Opposite Blue의 웹·커머스, AI 서비스, 디자인 업무 범위와 프로젝트 진행 과정을 소개합니다.',
};

const scope = [
  { title: '웹 · 커머스', color: 'bg-brand-yellow text-neutral-950', description: '기업·브랜드 웹사이트와 카페24·고도몰 쇼핑몰을 구축합니다. 기존 솔루션을 살릴지, 별도 개발이 필요한지부터 함께 확인합니다.', href: '/projects?cat=websites&project=30', link: 'LG전자 B2B 구축 사례 보기' },
  { title: 'AI 서비스 환경', color: 'bg-brand-blue text-white', description: '사내 데이터 검색, 업무 보조 에이전트, 외부 API 연동에 필요한 환경을 설계합니다. 사용할 데이터와 접근 권한, 자동화할 업무를 먼저 정하고 도입 범위를 협의합니다.', href: '/contact', link: 'AI 도입 범위 상담하기' },
  { title: '크리에이티브 · 콘텐츠', color: 'bg-brand-iceberg text-neutral-950', description: '커머스 상세페이지, 프로모션 배너, 브로셔·인쇄물을 제작합니다. 사용할 채널과 규격을 확인하고, 웹 경험과 콘텐츠가 이어지도록 구성합니다.', href: '/projects?cat=design&project=27', link: 'LG전자 정수기 브로셔 사례 보기' },
];
const process = [
  { title: '요청과 범위 확인', description: '목표, 현재 사이트와 자료, 필요한 기능, 예산과 희망 일정을 확인합니다. 정해지지 않은 항목은 상담에서 함께 정할 수 있습니다.' },
  { title: '구성과 제작', description: '협의한 범위를 기준으로 화면·콘텐츠·기능을 구성합니다. 제공할 자료와 확인이 필요한 지점을 정하고 제작을 진행합니다.' },
  { title: '검수와 조정', description: '주요 화면과 기능을 함께 확인합니다. 반응형 화면, 입력과 이동 동선, 합의한 요구사항을 기준으로 수정 범위를 조율합니다.' },
  { title: '배포와 인수인계', description: '운영 환경과 계정, 결과물, 관리 방법을 확인합니다. 원본·소스 제공 범위와 이후 유지보수는 프로젝트 협의 내용에 따릅니다.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-20">
      <section className="max-w-4xl space-y-6 pb-12 md:pb-16">
        <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-tight">
          웹, 콘텐츠, AI가<br className="hidden sm:block" /> <span className="font-semibold">하나의 업무로 이어지도록.</span>
        </h1>
        <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl">
          Opposite Blue는 웹사이트와 쇼핑몰 구축, 디자인, AI 서비스 환경을 함께 다룹니다. 필요한 결과와 운영 방식을 기준으로 프로젝트의 범위를 정합니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/projects" className="min-h-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-brand-blue">프로젝트 보러가기 <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
          <Link href="/contact" className="min-h-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-neutral-200">견적 문의하기 <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
      </section>
      <section aria-labelledby="scope-title" className="border-t border-gray-200 py-12 md:py-16">
        <h2 id="scope-title" className="text-2xl md:text-3xl font-semibold tracking-tight">필요한 범위부터 함께 정합니다</h2>
        <p className="mt-4 text-neutral-600 leading-relaxed max-w-2xl">하나의 서비스만 의뢰하거나, 웹과 콘텐츠·자동화를 함께 구성할 수 있습니다. 아래 사례에서 실제 작업물을 확인해 보세요.</p>
        <div className="mt-8 divide-y divide-gray-200">
          {scope.map((item) => (
            <article key={item.title} className="grid md:grid-cols-12 gap-4 md:gap-10 py-7">
              <div className="md:col-span-4"><h3 className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${item.color}`}>{item.title}</h3></div>
              <div className="md:col-span-8 space-y-4">
                <p className="text-base leading-relaxed text-neutral-600 max-w-2xl">{item.description}</p>
                <Link href={item.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-blue underline underline-offset-4">{item.link}<ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="process-title" className="border-t border-gray-200 py-12 md:py-16">
        <h2 id="process-title" className="text-2xl md:text-3xl font-semibold tracking-tight">문의부터 인수인계까지</h2>
        <p className="mt-4 text-neutral-600 leading-relaxed">일반적인 협의 흐름입니다. 상세 일정과 산출물은 프로젝트별로 정합니다.</p>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2">
          {process.map((step, index) => (
            <li key={step.title} className="space-y-3 border-t border-gray-200 pt-5">
              <h3 className="text-lg font-semibold flex items-center gap-3"><span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-brand-blue" aria-hidden="true">{index + 1}</span>{step.title}</h3>
              <p className="text-base text-neutral-600 leading-relaxed max-w-prose">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="border-t border-gray-200 pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div><h2 className="text-xl font-semibold">아직 구체적인 계획이 없어도 괜찮습니다.</h2><p className="mt-2 text-neutral-600">현재 상황과 만들고 싶은 결과를 알려주세요.</p></div>
        <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 bg-brand-yellow text-neutral-950 text-sm font-semibold shrink-0">프로젝트 상담하기<ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
