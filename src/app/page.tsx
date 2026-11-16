import Image from '@/components/PortfolioImage';
import Link from 'next/link';
import { ArrowUpRight, Cpu, Globe, Layers } from 'lucide-react';
import portfolioRaw from '@/data/portfolio_data.json';
import { PortfolioItem } from '@/types/portfolio';
import { getAssetPath } from '@/lib/utils';

const portfolioData = portfolioRaw as PortfolioItem[];

const leadProject = portfolioData.find((project) => project.id === 33);
const featuredIds = [33, 32, 30, 31, 27];
const featuredProjects = featuredIds
  .map((id) => portfolioData.find((p) => p.id === id))
  .filter((p): p is PortfolioItem => Boolean(p));
const serviceLedgers = [
  { title: 'Web & Commerce Development', description: '삼성전자·LG전자 B2B 웹사이트 구축 경험을 기반으로, 카페24·고도몰 쇼핑몰 및 최신 반응형 웹 플랫폼을 제작합니다.', Icon: Globe },
  { title: 'AI Service Environment', description: '비즈니스에 최적화된 LLM 연동, 사내 데이터 기반 맞춤형 AI 에이전트, 업무 자동화 워크플로우를 완벽하게 구축합니다.', Icon: Cpu },
  { title: 'Creative & Content Design', description: '오픈마켓 롱스크롤 상세페이지, 모션 프로모션 배너, 오프라인 브로셔 및 인쇄물까지 토탈 디자인을 책임집니다.', Icon: Layers },
];

export default function HomePage() {
  if (!leadProject) return null;
  const leadImage = leadProject.images[0];
  const leadImageSrc = leadImage ? getAssetPath(`/portfolio/${leadImage.relative_path}`) : '';

  return (
    <div>
      <section className="ledger-shell py-12 md:py-20">
        <div className="grid gap-10 border-t-[3px] border-neutral-950 pt-5 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-7">
            <p className="ledger-label">Opposite Blue / Seoul, KR</p>
            <h1 className="max-w-4xl text-5xl font-normal leading-[0.96] tracking-[-0.04em] text-neutral-950 sm:text-6xl md:text-7xl">Crafting high-performance websites</h1>
            <p className="ledger-prose text-lg text-neutral-700">Opposite Blue는 쇼핑몰과 웹사이트 구축부터 이커머스 솔루션, 최신 생성형 AI 서비스 인프라 구축까지 비즈니스의 성공적인 디지털 전환을 완벽히 구현합니다.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/projects" className="ledger-button ledger-button--ink">프로젝트 살펴보기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="/contact" className="ledger-button">견적 문의하기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
          <aside className="border-t border-neutral-950 pt-4 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="ledger-label">Current scope</p>
            <dl className="mt-4 divide-y divide-neutral-950 border-y border-neutral-950">
              <div className="grid grid-cols-[5rem_1fr] gap-3 py-3"><dt className="ledger-label">Web</dt><dd className="text-sm text-neutral-800">기업·브랜드 웹사이트와 카페24·고도몰 쇼핑몰</dd></div>
              <div className="grid grid-cols-[5rem_1fr] gap-3 py-3"><dt className="ledger-label">Commerce</dt><dd className="text-sm text-neutral-800">기존 솔루션 검토와 커스텀 구축</dd></div>
              <div className="grid grid-cols-[5rem_1fr] gap-3 py-3"><dt className="ledger-label">AI</dt><dd className="text-sm text-neutral-800">사내 데이터 검색, 업무 보조 에이전트, 외부 API 연동</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="ledger-shell pb-16 md:pb-24">
        <Link href="/projects?cat=websites&project=33" className="group block border-y-[3px] border-neutral-950 py-4 hover:bg-brand-yellow focus-visible:bg-brand-yellow">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3"><p className="ledger-label">Selected project / 33</p><p className="ledger-label">{leadProject.production_date}</p></div>
          <div className="grid gap-5 lg:grid-cols-12">
            <div className="relative aspect-[1849/949] overflow-hidden bg-[var(--surface-muted)] lg:col-span-8">
              {leadImage && <Image src={encodeURI(leadImageSrc)} alt={leadProject.title} fill priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover object-top" />}
            </div>
            <div className="flex flex-col justify-between lg:col-span-4">
              <div><h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950">{leadProject.title}</h2><p className="mt-3 text-base leading-relaxed text-neutral-700">{leadProject.cms}</p></div>
              <span className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-950 underline decoration-brand-yellow decoration-[3px] underline-offset-4">프로젝트 상세 보기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></span>
            </div>
          </div>
        </Link>
      </section>

      <section className="border-y border-neutral-950 bg-[var(--surface-subtle)]">
        <div className="ledger-shell py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-12"><div className="md:col-span-4"><h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-5xl">주요 핵심 역량</h2></div><p className="ledger-prose text-neutral-700 md:col-span-8">디자인, 프론트엔드/백엔드 개발, 커머스 커스터마이징, 최신 AI 에이전트 인프라까지 전 과정을 원스톱으로 제공합니다.</p></div>
          <div className="mt-10 border-t border-neutral-950">
            {serviceLedgers.map(({ title, description, Icon }, index) => <article key={title} className="grid gap-4 border-b border-neutral-950 py-6 md:grid-cols-12 md:gap-8"><div className="flex items-center gap-3 md:col-span-4"><span className="ledger-label">0{index + 1}</span><Icon className="h-5 w-5" aria-hidden="true" /><h3 className="font-semibold text-neutral-950">{title}</h3></div><p className="text-sm leading-relaxed text-neutral-700 md:col-span-8">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="ledger-shell py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5 border-t-[3px] border-neutral-950 pt-5"><h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Selected projects</h2><Link href="/projects" className="ledger-button">전체 프로젝트 보기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
        <div className="mt-8 border-t border-neutral-950">
          {featuredProjects.map((project, index) => {
            const firstImage = project.images[0];
            const imageSrc = firstImage ? getAssetPath(`/portfolio/${firstImage.relative_path}`) : null;
            return <Link key={project.id} href={`/projects?cat=${project.category === '웹사이트' ? 'websites' : 'design'}&project=${project.id}`} className="group grid gap-4 border-b border-neutral-950 py-4 hover:bg-brand-yellow md:grid-cols-12 md:items-center md:gap-6">
              <span className="ledger-label md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
              <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-muted)] md:col-span-3">{imageSrc ? <Image src={encodeURI(imageSrc)} alt={project.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover object-top" loading="lazy" /> : <span className="flex h-full items-center justify-center text-sm text-neutral-700">이미지 없음</span>}</div>
              <div className="md:col-span-5"><h3 className="text-xl font-semibold tracking-[-0.02em] text-neutral-950">{project.title}</h3><p className="mt-1 text-sm text-neutral-700">{project.cms || project.text_lines[0] || project.category}</p>{project.status === '운영 중단' && <span className="mt-2 inline-flex border border-neutral-950 px-2 py-1 text-xs text-neutral-800">운영 중단</span>}</div>
              <span className="ledger-label md:col-span-2">{project.production_date || project.category}</span><ArrowUpRight className="h-5 w-5 justify-self-end text-neutral-950 md:col-span-1" aria-hidden="true" />
            </Link>;
          })}
        </div>
      </section>
    </div>
  );
}
