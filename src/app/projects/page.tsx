'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, X, ChevronLeft, ChevronRight, Layers, ArrowLeft, ArrowRight, Globe, Palette } from 'lucide-react';
import portfolioRaw from '@/data/portfolio_data.json';
import { PortfolioItem } from '@/types/portfolio';
import { getAssetPath } from '@/lib/utils';

const portfolioData = portfolioRaw as PortfolioItem[];

type MainCategory = 'all' | 'websites' | 'design';
type DesignSubCategory = '전체' | '배너 디자인' | '컨텐츠 디자인' | '인쇄물 디자인';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
};

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCat = (searchParams.get('cat') as MainCategory) || 'all';
  const [mainCategory, setMainCategory] = useState<MainCategory>(initialCat);
  const [designFilter, setDesignFilter] = useState<DesignSubCategory>('전체');

  const [activeModalProject, setActiveModalProject] = useState<PortfolioItem | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState<number>(0);

  // Sync state with URL parameter if it changes
  useEffect(() => {
    const catParam = (searchParams.get('cat') as MainCategory) || 'all';
    setMainCategory(catParam);
  }, [searchParams]);

  const changeMainCategory = (cat: MainCategory) => {
    setMainCategory(cat);
    setDesignFilter('전체');
    if (cat === 'all') {
      router.push('/projects', { scroll: false });
    } else {
      router.push(`/projects?cat=${cat}`, { scroll: false });
    }
  };

const WEBSITE_PRODUCTION_DATES: Record<number, { text: string; sortKey: number }> = {
  32: { text: '2025년 6월', sortKey: 202506 },
  30: { text: '2023년 8월', sortKey: 202308 },
  31: { text: '2020년 5월', sortKey: 202005 },
  29: { text: '2020년 2월', sortKey: 202002 },
  28: { text: '2019년 12월', sortKey: 201912 },
  3: { text: '2017년 6월', sortKey: 201706 },
  5: { text: '2016년 11월', sortKey: 201611 },
  4: { text: '2016년 8월', sortKey: 201608 },
  2: { text: '2016년 01월', sortKey: 201601 },
};

  // Split projects into Websites and Design (Websites sorted by production date: newest first)
  const websiteProjects = useMemo(() => {
    return portfolioData
      .filter((p) => p.category === '웹사이트')
      .sort((a, b) => {
        const keyA = WEBSITE_PRODUCTION_DATES[a.id]?.sortKey ?? a.id;
        const keyB = WEBSITE_PRODUCTION_DATES[b.id]?.sortKey ?? b.id;
        return keyB - keyA;
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

  const openProjectModal = (project: PortfolioItem) => {
    setActiveModalProject(project);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setActiveModalProject(null);
    setModalImageIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Category / Sub-heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
          02 / Projects
        </span>
      </motion.div>

      {/* Main Editorial Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
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
      </motion.div>

      {/* Animate View Transitions */}
      <AnimatePresence mode="wait">
        {/* VIEW 1: ROOT TWO LARGE THUMBNAIL CARDS (Websites / Design) */}
        {mainCategory === 'all' && (
          <motion.div
            key="root-category-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="py-12 space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 1. Websites Big Card */}
              <motion.div
                variants={cardVariants}
                onClick={() => changeMainCategory('websites')}
                className="group cursor-pointer rounded-[5px] border border-gray-100 bg-white overflow-hidden hover:border-gray-200 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                  <img
                    src={getAssetPath('/portfolio/images/websites/31_tv-bracket-shop/01_tv-bracket-shop.png')}
                    alt="Websites Preview (TV브라켓 쇼핑몰)"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>{websiteProjects.length} Projects</span>
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
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
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                      <span>프로젝트 보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* 2. Design Big Card */}
              <motion.div
                variants={cardVariants}
                onClick={() => changeMainCategory('design')}
                className="group cursor-pointer rounded-[5px] border border-gray-100 bg-white overflow-hidden hover:border-gray-200 hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                  <img
                    src={getAssetPath('/portfolio/images/print-design/27_lg-purifier-brochure/01_lg-purifier-brochure.jpg')}
                    alt="Design Works Preview"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm">
                      <Palette className="w-3.5 h-3.5 text-purple-600" />
                      <span>22 Projects</span>
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
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
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 group-hover:text-purple-600 group-hover:translate-x-1 transition-all">
                      <span>프로젝트 보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: WEBSITES DETAIL VIEW */}
        {mainCategory === 'websites' && (
          <motion.div
            key="websites-category-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="py-8 space-y-8"
          >
            {/* Sub-Header & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeMainCategory('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>모든 카테고리</span>
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>Websites</span>
                  <span className="text-xs font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {websiteProjects.length} Projects
                  </span>
                </h2>
              </div>

              {/* Quick Switch to Design */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 hidden sm:inline">다른 카테고리:</span>
                <button
                  type="button"
                  onClick={() => changeMainCategory('design')}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Design (22) →
                </button>
              </div>
            </div>

            {/* Website Staggered Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {websiteProjects.map((project) => {
                const firstImage = project.images[0];
                const imageSrc = firstImage ? getAssetPath(`/portfolio/${firstImage.relative_path}`) : null;

                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className="group flex flex-col bg-white border border-gray-100 rounded-[5px] overflow-hidden hover:border-gray-200 hover:shadow-xl hover:shadow-neutral-100 transition-all duration-300 cursor-pointer"
                    onClick={() => openProjectModal(project)}
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      {imageSrc ? (
                        <img
                          src={encodeURI(imageSrc)}
                          alt={project.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          이미지 없음
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-neutral-800 shadow-2xs">
                          {project.category}
                        </span>
                        {project.cms && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900 text-white shadow-2xs">
                            {project.cms}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
                          <span className="text-neutral-500 line-clamp-1">
                            {project.text_lines[0] || (project.cms ? `CMS : ${project.cms}` : '')}
                          </span>
                          {(project.production_date || WEBSITE_PRODUCTION_DATES[project.id]?.text) && (
                            <span className="text-neutral-400 font-normal shrink-0">
                              {project.production_date || WEBSITE_PRODUCTION_DATES[project.id]?.text}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1 group-hover:text-neutral-700">
                          <Eye className="w-3.5 h-3.5" /> 상세 보기
                        </span>
                        {project.live_link && (
                          project.live_link.includes('dothome.co.kr') ? (
                            <span className="inline-flex items-center text-xs text-neutral-400 font-medium px-2 py-0.5 rounded-md bg-neutral-100">
                              운영 중단
                            </span>
                          ) : (
                            <a
                              href={project.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium py-1 px-2 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              <span>사이트 방문</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {/* VIEW 3: DESIGN DETAIL VIEW */}
        {mainCategory === 'design' && (
          <motion.div
            key={`design-category-view-${designFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="py-8 space-y-8"
          >
            {/* Sub-Header & Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => changeMainCategory('all')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>모든 카테고리</span>
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                  <span>Design Works</span>
                  <span className="text-xs font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                    22 Projects
                  </span>
                </h2>
              </div>

              {/* Quick Switch to Websites */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 hidden sm:inline">다른 카테고리:</span>
                <button
                  type="button"
                  onClick={() => changeMainCategory('websites')}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
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
                    onClick={() => setDesignFilter(sub)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all flex items-center gap-2 cursor-pointer ${
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

            {/* Design Staggered Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
              {filteredDesignProjects.map((project) => {
                const firstImage = project.images[0];
                const imageSrc = firstImage ? getAssetPath(`/portfolio/${firstImage.relative_path}`) : null;
                const totalImages = project.images.length;

                return (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className="group flex flex-col bg-white border border-gray-100 rounded-[5px] overflow-hidden hover:border-gray-200 hover:shadow-xl hover:shadow-neutral-100 transition-all duration-300 cursor-pointer"
                    onClick={() => openProjectModal(project)}
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      {imageSrc ? (
                        <img
                          src={encodeURI(imageSrc)}
                          alt={project.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          이미지 없음
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex flex-wrap gap-1.5 justify-end">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-neutral-800 shadow-2xs">
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
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        {project.text_lines.length > 0 && (
                          <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {project.text_lines[0]}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 flex items-center gap-1 group-hover:text-neutral-700">
                          <Eye className="w-3.5 h-3.5" /> 상세 보기
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Lightbox Modal */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                  {activeModalProject.category}
                </span>
                <h2 className="text-base md:text-xl font-bold text-neutral-900">
                  {activeModalProject.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
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
                  <div className="relative bg-neutral-50 rounded-[5px] border border-gray-100 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[560px]">
                    <img
                      src={encodeURI(getAssetPath(`/portfolio/${activeModalProject.images[modalImageIndex]?.relative_path}`))}
                      alt={`${activeModalProject.title} ${modalImageIndex + 1}`}
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
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md cursor-pointer"
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md cursor-pointer"
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
                          onClick={() => setModalImageIndex(idx)}
                          className={`relative w-20 h-16 rounded-[5px] overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            modalImageIndex === idx
                              ? 'border-neutral-900 scale-95 ring-2 ring-neutral-900/20'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={encodeURI(getAssetPath(`/portfolio/${img.relative_path}`))}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {activeModalProject.images[modalImageIndex] && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400 px-1">
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
                  <span className="block text-neutral-400 mb-1">카테고리</span>
                  <span className="font-medium text-neutral-800">{activeModalProject.category}</span>
                </div>
                {(activeModalProject.production_date || WEBSITE_PRODUCTION_DATES[activeModalProject.id]?.text) && (
                  <div>
                    <span className="block text-neutral-400 mb-1">제작 연월</span>
                    <span className="font-semibold text-neutral-900">
                      {activeModalProject.production_date || WEBSITE_PRODUCTION_DATES[activeModalProject.id]?.text}
                    </span>
                  </div>
                )}
                {activeModalProject.cms && (
                  <div>
                    <span className="block text-neutral-400 mb-1">사용 솔루션 (CMS)</span>
                    <span className="font-semibold text-blue-600">{activeModalProject.cms}</span>
                  </div>
                )}
                {activeModalProject.live_link && (
                  <div>
                    <span className="block text-neutral-400 mb-1">라이브 사이트</span>
                    {activeModalProject.live_link.includes('dothome.co.kr') ? (
                      <span className="font-semibold text-neutral-400">운영 중단</span>
                    ) : (
                      <a
                        href={activeModalProject.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
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
                  <h4 className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">
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
              <span className="text-xs text-neutral-400">
                Opposite Blue Project
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-medium text-neutral-700 bg-white border border-gray-200 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-24 text-neutral-400">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
