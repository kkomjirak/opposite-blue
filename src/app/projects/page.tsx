'use client';

import Image from '@/components/PortfolioImage';
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef, Suspense, type MouseEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink, Eye, X, ChevronLeft, ChevronRight, Layers, ArrowLeft, ArrowRight, Globe, Palette } from 'lucide-react';
import portfolioRaw from '@/data/portfolio_data.json';
import { PortfolioItem } from '@/types/portfolio';
import { getAssetPath } from '@/lib/utils';

const portfolioData = portfolioRaw as PortfolioItem[];

type MainCategory = 'all' | 'websites' | 'design';
type DesignSubCategory = '전체' | '배너 디자인' | '컨텐츠 디자인' | '인쇄물 디자인';

const MAIN_CATEGORIES: MainCategory[] = ['all', 'websites', 'design'];

const WEBSITE_PRODUCTION_DATES: Record<number, { text: string }> = {
  32: { text: '2025년 6월' },
  30: { text: '2023년 8월' },
  31: { text: '2020년 5월' },
  29: { text: '2020년 2월' },
  28: { text: '2019년 12월' },
  3: { text: '2017년 6월' },
  5: { text: '2016년 11월' },
  4: { text: '2016년 8월' },
  2: { text: '2016년 01월' },
};

function parseProductionMonth(value: string | null | undefined) {
  const match = value?.match(/(\d{4})년\s*(\d{1,2})월/);
  return match ? Number(match[1]) * 100 + Number(match[2]) : 0;
}

function parseMainCategory(value: string | null): MainCategory {
  if (value && MAIN_CATEGORIES.includes(value as MainCategory)) {
    return value as MainCategory;
  }

  return 'all';
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mainCategory = parseMainCategory(searchParams.get('cat'));
  const [designFilter, setDesignFilter] = useState<DesignSubCategory>('전체');

  const projectId = searchParams.get('project');
  const activeModalProject = portfolioData.find((project) =>
    String(project.id) === projectId &&
    (project.category === '웹사이트' ? mainCategory === 'websites' : mainCategory === 'design')
  ) ?? null;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !activeModalProject) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;

      if (returnFocus?.isConnected && returnFocus !== document.body) {
        returnFocus.focus({ preventScroll: true });
      } else {
        document.querySelector<HTMLElement>('[data-project-list-heading]')?.focus({ preventScroll: true });
      }
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [activeModalProject]);

  const changeMainCategory = (cat: MainCategory) => {
    setDesignFilter('전체');
    if (cat === 'all') {
      router.push('/projects', { scroll: false });
    } else {
      router.push(`/projects?cat=${cat}`, { scroll: false });
    }
  };

  // Sort website projects by production month: the newest production is always first.
  const websiteProjects = useMemo(() => {
    return portfolioData
      .filter((p) => p.category === '웹사이트')
      .sort((a, b) => {
        const keyA = parseProductionMonth(a.production_date);
        const keyB = parseProductionMonth(b.production_date);
        return keyB - keyA || b.id - a.id;
      });
  }, []);

  const designProjects = useMemo(() => {
    return portfolioData
      .filter((p) => p.category !== '웹사이트')
      .sort((a, b) => b.id - a.id);
  }, []);

  const filteredDesignProjects = useMemo(() => {
    if (designFilter === '전체') return designProjects;
    return designProjects.filter((p) => p.category === designFilter);
  }, [designProjects, designFilter]);

  const designCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: designProjects.length };
    designProjects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [designProjects]);

  const openProjectModal = (project: PortfolioItem, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (activeModalProject) return;
    setModalImageIndex(0);
    window.history.pushState({ projectOpenedFromList: true }, '', `/projects?cat=${project.category === '웹사이트' ? 'websites' : 'design'}&project=${project.id}`);
  };

  const closeModal = () => {
    if (window.history.state?.projectOpenedFromList) {
      window.history.back();
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('project');
      window.history.replaceState(null, '', `/projects${params.size ? `?${params}` : ''}`);
    }
    setModalImageIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Category / Sub-heading */}
      <div
        className="mb-6"
      >
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-600">
          02 / Projects
        </span>
      </div>

      {/* Main Editorial Headline */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-100"
      >
        <div className="md:col-span-8">
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-tight">
            A curated collection of{' '}
            <span className="font-semibold text-neutral-950">Websites</span> &{' '}
            <span className="font-semibold text-neutral-950">Design</span> works.
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-500 max-w-2xl leading-relaxed">
            B2B 플랫폼부터 이커머스 솔루션, 브랜드 프로모션, 초고해상도 상세페이지 및 인쇄물까지 어퍼짓 블루(Opposite Blue)의 실제 프로젝트 결과물입니다.
          </p>
        </div>
      </div>

        {/* VIEW 1: ROOT TWO LARGE THUMBNAIL CARDS (Websites / Design) */}
        {mainCategory === 'all' && (
          <div
            key="root-category-view"
            className="py-12 space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Websites Big Card */}
              <Link
                href="/projects?cat=websites"
                scroll={false}
                className="group cursor-pointer rounded-[5px] border border-gray-200 bg-white overflow-hidden hover:border-gray-400 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all motion-reduce:transition-none duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                  <Image
                    src={getAssetPath('/portfolio/images/websites/31_tv-bracket-shop/01_tv-bracket-shop.png')}
                    alt="Websites Preview (TV브라켓 쇼핑몰)"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top motion-safe:group-hover:scale-105 transition-transform motion-reduce:transition-none duration-700 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-yellow text-neutral-950 shadow-sm">
                      <Globe className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>{websiteProjects.length} Projects</span>
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-yellow font-semibold">
                      Category 01
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight">Websites</h2>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    삼성전자·LG전자 B2B 웹사이트 및 카페24, 고도몰, 그누보드 기반 커머스 쇼핑몰 구축 프로젝트입니다.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">삼성전자 B2B</span>
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">LG전자 B2B</span>
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">쇼핑몰 (고도몰/카페24)</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 group-hover:text-brand-blue motion-safe:group-hover:translate-x-1 transition-all motion-reduce:transition-none">
                      <span>프로젝트 보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* 2. Design Big Card */}
              <Link
                href="/projects?cat=design"
                scroll={false}
                className="group cursor-pointer rounded-[5px] border border-gray-200 bg-white overflow-hidden hover:border-gray-400 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all motion-reduce:transition-none duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                  <Image
                    src={getAssetPath('/portfolio/images/print-design/27_lg-purifier-brochure/01_lg-purifier-brochure.jpg')}
                    alt="Design Works Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top motion-safe:group-hover:scale-105 transition-transform motion-reduce:transition-none duration-700 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-iceberg text-neutral-950 shadow-sm">
                      <Palette className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>22 Projects</span>
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-brand-iceberg font-semibold">
                      Category 02
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight">Design</h2>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
                    프로모션 이벤트 배너(10건), 오픈마켓 초장문 상세페이지(8건), LG전자 정수기 브로셔 등 고해상도 인쇄물(4건) 디자인 작업물입니다.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">배너 디자인 (10)</span>
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">컨텐츠 상세페이지 (8)</span>
                      <span className="px-2.5 py-1 rounded-md text-xs bg-neutral-100 text-neutral-600">인쇄물 브로셔 (4)</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 group-hover:text-brand-blue motion-safe:group-hover:translate-x-1 transition-all motion-reduce:transition-none">
                      <span>프로젝트 보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* VIEW 2: WEBSITES DETAIL VIEW */}
        {mainCategory === 'websites' && (
          <div
            key="websites-category-view"
            className="py-8 space-y-8"
          >
            {/* Sub-Header & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeMainCategory('all')}
                  className="inline-flex items-center gap-1.5 min-w-11 min-h-11 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors motion-reduce:transition-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>모든 카테고리</span>
                </button>
                <h2 tabIndex={-1} data-project-list-heading className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>Websites</span>
                  <span className="text-xs font-normal text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {websiteProjects.length} Projects
                  </span>
                </h2>
              </div>

              {/* Quick Switch to Design */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 hidden sm:inline">다른 카테고리:</span>
                <button
                  type="button"
                  onClick={() => changeMainCategory('design')}
                  className="min-w-11 min-h-11 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors motion-reduce:transition-none cursor-pointer"
                >
                  Design (22) →
                </button>
              </div>
            </div>

            {/* Website Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websiteProjects.map((project) => {
                const firstImage = project.images[0];
                const imageSrc = firstImage ? getAssetPath(`/portfolio/${firstImage.relative_path}`) : null;

                return (
                  <div
                    key={project.id}
                    className="group relative flex flex-col bg-white border border-gray-200 rounded-[5px] overflow-hidden hover:border-gray-400 hover:shadow-xl hover:shadow-neutral-100 transition-all motion-reduce:transition-none duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-brand-blue"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      {imageSrc ? (
                        <Image
                          src={encodeURI(imageSrc)}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top motion-safe:group-hover:scale-105 transition-transform motion-reduce:transition-none duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                          이미지 없음
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                        <span className="inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-neutral-800 shadow-2xs">
                          {project.category}
                        </span>
                        {project.cms && (
                          <span className="inline-flex items-center leading-none px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900 text-white shadow-2xs">
                            {project.cms}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900 group-hover:text-brand-blue transition-colors motion-reduce:transition-none line-clamp-1">
                          <a href={`/projects?cat=websites&project=${project.id}`} onClick={(event) => openProjectModal(project, event)} className="after:absolute after:inset-0">
                            {project.title}
                          </a>
                        </h3>
                        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                          <span className="text-neutral-500 line-clamp-1">
                            {project.cms || project.text_lines[0] || ''}
                          </span>
                          {(project.production_date || WEBSITE_PRODUCTION_DATES[project.id]?.text) && (
                            <span className="text-neutral-600 font-normal shrink-0">
                              {project.production_date || WEBSITE_PRODUCTION_DATES[project.id]?.text}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-600 flex items-center gap-1 group-hover:text-neutral-700">
                          <Eye className="w-3.5 h-3.5" /> 상세 보기
                        </span>
                        {project.live_link && (
                          (project.status === '운영 중단' || project.live_link.includes('dothome.co.kr')) ? (
                            <span className="inline-flex items-center text-xs text-neutral-600 font-medium px-2 py-0.5 rounded-md bg-neutral-100">
                              운영 중단
                            </span>
                          ) : (
                            <a
                              href={project.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative z-10 min-w-11 min-h-11 inline-flex items-center gap-1 text-xs text-neutral-900 font-semibold py-1 px-2.5 rounded-md bg-brand-yellow/20 hover:bg-brand-yellow hover:text-neutral-950 border border-brand-yellow/40 transition-colors motion-reduce:transition-none"
                            >
                              <span>사이트 방문</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: DESIGN DETAIL VIEW */}
        {mainCategory === 'design' && (
          <div
            key="design-category-view"
            className="py-8 space-y-8"
          >
            {/* Sub-Header & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeMainCategory('all')}
                  className="inline-flex items-center gap-1.5 min-w-11 min-h-11 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors motion-reduce:transition-none cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>모든 카테고리</span>
                </button>
                <h2 tabIndex={-1} data-project-list-heading className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>Design Works</span>
                  <span className="text-xs font-normal text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
                    22 Projects
                  </span>
                </h2>
              </div>

              {/* Quick Switch to Websites */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 hidden sm:inline">다른 카테고리:</span>
                <button
                  type="button"
                  onClick={() => changeMainCategory('websites')}
                  className="min-w-11 min-h-11 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors motion-reduce:transition-none cursor-pointer"
                >
                  Websites ({websiteProjects.length}) →
                </button>
              </div>
            </div>

            {/* Design Subcategory Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(['전체', '배너 디자인', '컨텐츠 디자인', '인쇄물 디자인'] as DesignSubCategory[]).map((sub) => {
                const isSelected = designFilter === sub;
                const count = designCounts[sub] || 0;
                return (
                  <button
                    key={sub}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setDesignFilter(sub)}
                    className={`min-w-11 min-h-11 px-4 py-2 rounded-full text-xs md:text-sm transition-all motion-reduce:transition-none flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-950 text-white font-medium shadow-sm'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                    }`}
                  >
                    <span>{sub}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Design Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
              {filteredDesignProjects.map((project) => {
                const firstImage = project.images[0];
                const imageSrc = firstImage ? getAssetPath(`/portfolio/${firstImage.relative_path}`) : null;
                const totalImages = project.images.length;

                return (
                  <div
                    key={project.id}
                    className="group relative flex flex-col bg-white border border-gray-200 rounded-[5px] overflow-hidden hover:border-gray-400 hover:shadow-xl hover:shadow-neutral-100 transition-all motion-reduce:transition-none duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-brand-blue"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      {imageSrc ? (
                        <Image
                          src={encodeURI(imageSrc)}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top motion-safe:group-hover:scale-105 transition-transform motion-reduce:transition-none duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                          이미지 없음
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                        <span className="inline-flex items-center leading-none px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-neutral-800 shadow-2xs">
                          {project.category}
                        </span>
                      </div>

                      {totalImages > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-[11px] font-mono bg-black/70 backdrop-blur-md text-white flex items-center gap-1 shadow-2xs">
                          <Layers className="w-3 h-3" />
                          <span>+{totalImages} 장</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900 group-hover:text-brand-blue transition-colors motion-reduce:transition-none line-clamp-1">
                          <a href={`/projects?cat=design&project=${project.id}`} onClick={(event) => openProjectModal(project, event)} className="after:absolute after:inset-0">
                            {project.title}
                          </a>
                        </h3>
                        {project.text_lines.length > 0 && (
                          <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {project.text_lines[0]}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-600 flex items-center gap-1 group-hover:text-neutral-700">
                          <Eye className="w-3.5 h-3.5" /> 상세 보기
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Project Detail Lightbox Modal */}
      {activeModalProject && (
        <dialog
          ref={dialogRef}
          aria-labelledby="project-dialog-title"
          className="m-auto w-[calc(100%-2rem)] max-w-5xl max-h-[90dvh] p-0 bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm"
          onCancel={(event) => { event.preventDefault(); closeModal(); }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            const rect = event.currentTarget.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal();
          }}
        >
          <div
            className="relative w-full max-h-[90dvh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                  {activeModalProject.category}
                </span>
                <h2 id="project-dialog-title" className="text-base md:text-xl font-bold text-neutral-900">
                  {activeModalProject.title}
                </h2>
              </div>
              <button
                type="button"
                autoFocus
                onClick={closeModal}
                className="min-w-11 min-h-11 shrink-0 inline-flex items-center justify-center p-2 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors motion-reduce:transition-none cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="overflow-y-auto flex-1 p-6 space-y-8">
              {/* Image Showcase */}
              {activeModalProject.images.length > 0 && (
                <div className="space-y-4">
                  <div className="relative bg-neutral-50 rounded-[5px] border border-gray-200 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[560px]">
                    <Image
                      src={encodeURI(getAssetPath(`/portfolio/${activeModalProject.images[modalImageIndex]?.relative_path}`))}
                      alt={`${activeModalProject.title} ${modalImageIndex + 1}`}
                      width={activeModalProject.images[modalImageIndex]?.width ?? 1200}
                      height={activeModalProject.images[modalImageIndex]?.height ?? 800}
                      className="max-w-full max-h-[560px] object-contain rounded-[5px]"
                    />

                    {activeModalProject.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === 0 ? activeModalProject.images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 min-w-11 min-h-11 inline-flex items-center justify-center p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors motion-reduce:transition-none shadow-md cursor-pointer"
                          aria-label="이전 이미지"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setModalImageIndex((prev) =>
                              prev === activeModalProject.images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 min-w-11 min-h-11 inline-flex items-center justify-center p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors motion-reduce:transition-none shadow-md cursor-pointer"
                          aria-label="다음 이미지"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {activeModalProject.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {activeModalProject.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`이미지 ${idx + 1} 보기`}
                          aria-current={modalImageIndex === idx ? 'true' : 'false'}
                          onClick={() => setModalImageIndex(idx)}
                          className={`relative w-20 h-16 rounded-[5px] overflow-hidden shrink-0 border-2 transition-all motion-reduce:transition-none cursor-pointer ${
                            modalImageIndex === idx
                              ? 'border-neutral-900 scale-95 ring-2 ring-neutral-900/20'
                              : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={encodeURI(getAssetPath(`/portfolio/${img.relative_path}`))}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {activeModalProject.images[modalImageIndex] && (
                    <div aria-live="polite" aria-atomic="true" className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 px-1">
                      <span>
                        이미지 {modalImageIndex + 1} / {activeModalProject.images.length}
                      </span>
                      <span>
                        해상도:{' '}
                        {activeModalProject.images[modalImageIndex].width} x{' '}
                        {activeModalProject.images[modalImageIndex].height} px (
                        {activeModalProject.images[modalImageIndex].format}) •{' '}
                        {activeModalProject.images[modalImageIndex].size_kb} KB
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Project Meta Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-neutral-50 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <span className="block text-neutral-600 mb-1">카테고리</span>
                  <span className="font-medium text-neutral-800">{activeModalProject.category}</span>
                </div>
                {(activeModalProject.production_date || WEBSITE_PRODUCTION_DATES[activeModalProject.id]?.text) && (
                  <div>
                    <span className="block text-neutral-600 mb-1">제작 연월</span>
                    <span className="font-semibold text-neutral-900">
                      {activeModalProject.production_date || WEBSITE_PRODUCTION_DATES[activeModalProject.id]?.text}
                    </span>
                  </div>
                )}
                {activeModalProject.cms && (
                  <div>
                    <span className="block text-neutral-600 mb-1">기술 스택</span>
                    <span className="font-semibold text-neutral-900 bg-brand-yellow/20 px-2 py-0.5 rounded border border-brand-yellow/40">{activeModalProject.cms}</span>
                  </div>
                )}
                {activeModalProject.live_link && (
                  <div>
                    <span className="block text-neutral-600 mb-1">라이브 사이트</span>
                    {(activeModalProject.status === '운영 중단' || activeModalProject.live_link.includes('dothome.co.kr')) ? (
                      <span className="font-semibold text-neutral-600">운영 중단</span>
                    ) : (
                      <a
                        href={activeModalProject.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-11 min-h-11 inline-flex items-center gap-1 font-semibold text-brand-blue hover:text-brand-blue/80 underline underline-offset-4 decoration-brand-yellow decoration-2"
                      >
                        방문하기 <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Notes & Description */}
              {activeModalProject.text_lines.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-semibold text-neutral-600 tracking-wider">
                    프로젝트 설명
                  </h4>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-1.5 text-sm text-neutral-600">
                    {activeModalProject.text_lines.map((line, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-neutral-50/70 flex items-center justify-between">
              <span className="text-xs text-neutral-600">
                Opposite Blue Project
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="min-w-11 min-h-11 px-4 py-2 text-xs font-medium text-neutral-700 bg-white border border-gray-200 rounded-lg hover:bg-neutral-100 transition-colors motion-reduce:transition-none cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-24 text-neutral-600">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
