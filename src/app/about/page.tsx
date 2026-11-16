import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About us — Opposite Blue',
  description: 'Opposite Blue의 웹·커머스, AI 서비스, 디자인 업무 범위와 프로젝트 진행 과정을 소개합니다.',
};

const scope = [
  { title: '웹 · 커머스', color: 'ledger-scope--yellow', description: '기업·브랜드 웹사이트와 카페24·고도몰 쇼핑몰을 구축합니다. 기존 솔루션을 살릴지, 별도 개발이 필요한지부터 함께 확인합니다.', href: '/projects?cat=websites&project=30', link: 'LG전자 B2B 구축 사례 보기' },
  { title: 'AI 서비스 환경', color: 'ledger-scope--blue', description: '사내 데이터 검색, 업무 보조 에이전트, 외부 API 연동에 필요한 환경을 설계합니다. 사용할 데이터와 접근 권한, 자동화할 업무를 먼저 정하고 도입 범위를 협의합니다.', href: '/contact', link: 'AI 도입 범위 상담하기' },
  { title: '크리에이티브 · 콘텐츠', color: 'ledger-scope--ice', description: '커머스 상세페이지, 프로모션 배너, 브로셔·인쇄물을 제작합니다. 사용할 채널과 규격을 확인하고, 웹 경험과 콘텐츠가 이어지도록 구성합니다.', href: '/projects?cat=design&project=27', link: 'LG전자 정수기 브로셔 사례 보기' },
];
const process = [
  { title: '요청과 범위 확인', description: '목표, 현재 사이트와 자료, 필요한 기능, 예산과 희망 일정을 확인합니다. 정해지지 않은 항목은 상담에서 함께 정할 수 있습니다.' },
  { title: '구성과 제작', description: '협의한 범위를 기준으로 화면·콘텐츠·기능을 구성합니다. 제공할 자료와 확인이 필요한 지점을 정하고 제작을 진행합니다.' },
  { title: '검수와 조정', description: '주요 화면과 기능을 함께 확인합니다. 반응형 화면, 입력과 이동 동선, 합의한 요구사항을 기준으로 수정 범위를 조율합니다.' },
  { title: '배포와 인수인계', description: '운영 환경과 계정, 결과물, 관리 방법을 확인합니다. 원본·소스 제공 범위와 이후 유지보수는 프로젝트 협의 내용에 따릅니다.' },
];

export default function AboutPage() {
  return (
    <div className="ledger-shell py-12 md:py-20">
      <section className="max-w-4xl space-y-6 border-t-[3px] border-neutral-950 pt-5 pb-12 md:pb-16">
        <h1 className="text-5xl font-normal leading-[0.98] tracking-[-0.04em] text-neutral-950 md:text-7xl">
          웹, 콘텐츠, AI가<br className="hidden sm:block" /> <span>하나의 업무로 이어지도록.</span>
        </h1>
        <p className="ledger-prose text-lg text-neutral-700">
          Opposite Blue는 웹사이트와 쇼핑몰 구축, 디자인, AI 서비스 환경을 함께 다룹니다. 필요한 결과와 운영 방식을 기준으로 프로젝트의 범위를 정합니다.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/projects" className="ledger-button ledger-button--ink">프로젝트 보러가기 <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
          <Link href="/contact" className="ledger-button">견적 문의하기 <ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
        </div>
      </section>
      <section aria-labelledby="scope-title" className="border-t-[3px] border-neutral-950 py-12 md:py-16">
        <h2 id="scope-title" className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">필요한 범위부터 함께 정합니다</h2>
        <p className="ledger-prose mt-5 text-neutral-700">하나의 서비스만 의뢰하거나, 웹과 콘텐츠·자동화를 함께 구성할 수 있습니다. 아래 사례에서 실제 작업물을 확인해 보세요.</p>
        <div className="mt-8 border-t border-neutral-950">
          {scope.map((item) => (
            <article key={item.title} className="grid gap-4 border-b border-neutral-950 py-7 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4"><h3 className={`inline-flex border border-neutral-950 px-4 py-2 text-sm font-semibold ${item.color}`}>{item.title}</h3></div>
              <div className="md:col-span-8 space-y-4">
                <p className="max-w-2xl text-base leading-relaxed text-neutral-700">{item.description}</p>
                <Link href={item.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-blue underline decoration-brand-yellow decoration-2 underline-offset-4">{item.link}<ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="process-title" className="border-t-[3px] border-neutral-950 py-12 md:py-16">
        <h2 id="process-title" className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">문의부터 인수인계까지</h2>
        <p className="mt-5 text-neutral-700 leading-relaxed">일반적인 협의 흐름입니다. 상세 일정과 산출물은 프로젝트별로 정합니다.</p>
        <ol className="mt-8 border-t border-neutral-950">
          {process.map((step, index) => (
            <li key={step.title} className="grid gap-3 border-b border-neutral-950 py-5 md:grid-cols-12"><span className="ledger-label md:col-span-1" aria-hidden="true">0{index + 1}</span><h3 className="text-lg font-semibold md:col-span-4">{step.title}</h3><p className="max-w-prose text-base leading-relaxed text-neutral-700 md:col-span-7">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="flex flex-col justify-between gap-5 border-t-[3px] border-neutral-950 pt-10 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-semibold tracking-[-0.02em]">아직 구체적인 계획이 없어도 괜찮습니다.</h2><p className="mt-2 text-neutral-700">현재 상황과 만들고 싶은 결과를 알려주세요.</p></div>
        <Link href="/contact" className="ledger-button ledger-button--signal shrink-0">프로젝트 상담하기<ArrowUpRight className="w-4 h-4" aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
