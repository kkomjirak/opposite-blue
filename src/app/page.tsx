import Link from 'next/link';
import { ArrowUpRight, CheckCircle, Code2, Cpu, Globe, Layers, Sparkles } from 'lucide-react';
import portfolioRaw from '@/data/portfolio_data.json';
import { PortfolioItem } from '@/types/portfolio';

const portfolioData = portfolioRaw as PortfolioItem[];

// Pick top 4 featured projects for the homepage (newest / flagship works)
const featuredIds = [32, 30, 31, 27];
const featuredProjects = featuredIds
  .map((id) => portfolioData.find((p) => p.id === id))
  .filter((p): p is PortfolioItem => Boolean(p));

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Typography */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-neutral-100 text-neutral-800 border border-neutral-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Web Agency & AI Service Solutions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-[1.12]">
              Crafting <span className="font-semibold text-neutral-950">high-performance websites</span> and building{' '}
              <span className="text-neutral-400">autonomous</span>{' '}
              <span className="font-semibold text-neutral-950">AI service environments.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-500 max-w-xl leading-relaxed font-normal">
              Opposite Blue는 삼성전자·LG전자 대기업 B2B 플랫폼부터 이커머스 솔루션, 최신 생성형 AI 서비스 인프라 구축까지 비즈니스의 성공적인 디지털 전환을 완벽히 구현합니다.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                className="px-6 py-3.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow"
              >
                <span>프로젝트 살펴보기</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors flex items-center gap-2"
              >
                <span>견적 문의하기</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 bg-neutral-50 shadow-xl shadow-neutral-100 group">
              <div className="aspect-[4/3] relative overflow-hidden bg-neutral-900">
                <img
                  src="/portfolio/images/웹사이트/31_TV브라켓_쇼핑몰/01_superbshop.png"
                  alt="TV브라켓 쇼핑몰 (수퍼브샵)"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/20 backdrop-blur-md">
                    Featured Commerce
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">TV브라켓 쇼핑몰</h3>
                  <p className="text-xs text-neutral-300">CMS: 고도몰 • TV 거치대/브라켓 전문 쇼핑몰</p>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="p-6 bg-white grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                <div>
                  <span className="block text-2xl font-bold text-neutral-950">30+</span>
                  <span className="text-[11px] text-neutral-400">완료 프로젝트</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600">B2B</span>
                  <span className="text-[11px] text-neutral-400">삼성/LG 레퍼런스</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-neutral-950">AI</span>
                  <span className="text-[11px] text-neutral-400">서비스 환경 구축</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: INFO (01 / Info) */}
      <section className="border-t border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                01 / Info
              </span>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-2">Opposite Blue</h2>
            </div>
            <div className="md:col-span-8 space-y-6">
              <p className="text-xl md:text-2xl font-light text-neutral-800 leading-relaxed">
                우리는 단순한 웹페이지 제작을 넘어, 비즈니스가 안정적으로 성장하고 고객과 소통할 수 있는{' '}
                <strong className="font-semibold text-neutral-950">고성능 웹 환경</strong>과{' '}
                <strong className="font-semibold text-neutral-950">AI 기반의 자동화 생태계</strong>를 함께 구축합니다.
              </p>
              <p className="text-base text-neutral-500 leading-relaxed">
                쇼핑몰 솔루션(카페24, 고도몰)부터 대기업 B2B 사이트, 전환율 최적화 상세페이지, 그리고 사내 업무 효율을 극대화하는 맞춤형 AI 서비스 환경까지 올인원으로 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: SERVICES (02 / Services) */}
      <section className="border-t border-gray-100 py-16 md:py-24 bg-neutral-50/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
            <div className="md:col-span-4">
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                02 / Services
              </span>
              <h2 className="text-2xl font-semibold text-neutral-900 mt-2">주요 핵심 역량</h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-base text-neutral-500 leading-relaxed">
                디자인, 프론트엔드/백엔드 개발, 커머스 커스터마이징, 최신 AI 에이전트 인프라까지 전 과정을 원스톱으로 제공합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-400">001</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Web & Commerce Development</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  삼성전자·LG전자 B2B 웹사이트 구축 경험을 기반으로, 카페24·고도몰 쇼핑몰 및 최신 반응형 웹 플랫폼을 제작합니다.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> B2B 기업/브랜드 웹사이트
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> 카페24, 고도몰, 그누보드 커스텀
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> 모바일 반응형 & 웹 표준 최적화
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-400">002</span>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">AI Service Environment</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  비즈니스에 최적화된 LLM 연동, 사내 데이터 기반 맞춤형 AI 에이전트, 업무 자동화 워크플로우를 완벽하게 구축합니다.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> LLM / RAG 검색 파이프라인
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> 사내 업무 보조 자율 에이전트
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600" /> MCP 및 외부 API 연동 인프라
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-mono text-neutral-400">003</span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Creative & Content Design</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  오픈마켓 롱스크롤 상세페이지(최대 6,600px+), 모션 프로모션 배너, 오프라인 브로셔 및 인쇄물까지 토탈 디자인을 책임집니다.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-600 pt-4 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 초고해상도 커머스 상세페이지
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> 시즌/이벤트 모션 배너 (GIF)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> LG전자 정수기 등 브로셔 인쇄물
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: SELECTED WORK (03 / Work) */}
      <section className="border-t border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
                03 / Selected Work
              </span>
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-neutral-900 mt-2">
                Featured <span className="font-semibold text-neutral-950">Projects</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:text-blue-600 transition-colors"
            >
              전체 {portfolioData.length}개 프로젝트 보기 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((p) => {
              const firstImg = p.images[0];
              const imgSrc = firstImg ? `/portfolio/${firstImg.relative_path}` : '';
              return (
                <Link
                  key={p.id}
                  href="/projects"
                  className="group block rounded-3xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-neutral-100 overflow-hidden relative">
                    <img
                      src={encodeURI(imgSrc)}
                      alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 flex gap-2 justify-end">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-neutral-800 shadow-2xs">
                        {p.category}
                      </span>
                      {p.cms && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-900 text-white shadow-2xs">
                          {p.cms}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-neutral-500 line-clamp-1">
                        {p.text_lines[0] || 'Opposite Blue 프로젝트'}
                      </span>
                      {p.production_date && (
                        <span className="text-neutral-400 shrink-0 font-normal">
                          {p.production_date}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
