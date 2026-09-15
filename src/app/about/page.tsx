import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
      {/* Category / Sub-heading */}
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">
          01 / About us
        </span>
      </div>

      {/* Main Editorial Headline copying arturospatino style */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-gray-100">
        <div className="md:col-span-8">
          <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-neutral-900 leading-tight">
            Building the <span className="font-semibold text-neutral-950">next generation</span> of{' '}
            <span className="text-neutral-400">digital experiences</span> and{' '}
            <span className="font-semibold text-neutral-950">AI ecosystems</span>.
          </h1>
          <p className="mt-8 text-lg text-neutral-500 max-w-2xl leading-relaxed">
            Opposite Blue는 웹사이트 제작 및 AI 서비스 환경 구축을 선도하는 전문 에이전시입니다.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="py-12 flex flex-wrap items-center gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-sm hover:shadow"
        >
          <span>프로젝트 보러가기</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
        >
          <span>견적 문의하기</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
