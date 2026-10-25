import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-neutral-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-8 space-y-5">
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-neutral-900 leading-tight">
              다음 프로젝트를<br /><span className="font-semibold">함께 구체화해 볼까요?</span>
            </h2>
            <p className="text-base text-neutral-600 max-w-xl leading-relaxed">웹사이트와 커머스, 디자인, AI 서비스 환경. 필요한 범위와 현재 상황부터 이야기해 주세요.</p>
            <Link href="/contact" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-brand-yellow/80">
              프로젝트 문의하기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="md:col-span-4 space-y-7">
            <nav aria-label="하단 메뉴">
              <ul className="flex flex-wrap gap-x-6 text-sm text-neutral-700">
                <li><Link href="/about" className="inline-flex min-h-11 items-center hover:text-brand-blue">About us</Link></li>
                <li><Link href="/projects" className="inline-flex min-h-11 items-center hover:text-brand-blue">Projects</Link></li>
                <li><Link href="/contact" className="inline-flex min-h-11 items-center hover:text-brand-blue">Contact</Link></li>
              </ul>
            </nav>
            <div className="space-y-1">
              <a href="mailto:contact@oppositeblue.co.kr" className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-700 underline underline-offset-4 hover:text-brand-blue">
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" /> contact@oppositeblue.co.kr
              </a>
              <p className="text-sm text-neutral-600">Seoul, Republic of Korea</p>
            </div>
          </div>
        </div>
        <div className="pt-5 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
          <p>© {new Date().getFullYear()} Opposite Blue. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand-blue">개인정보 처리 안내</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand-blue">사이트 이용 안내</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
