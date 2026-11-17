import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t-[3px] border-neutral-950 bg-[var(--surface-subtle)]">
      <div className="ledger-shell py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-8 space-y-5">
            <h2 className="text-3xl font-normal leading-tight tracking-[-0.03em] text-neutral-950 md:text-5xl">
              다음 프로젝트를<br /><span>함께 구체화해 볼까요?</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-neutral-700">웹사이트와 커머스, 디자인, AI 서비스 환경. 필요한 범위와 현재 상황부터 이야기해 주세요.</p>
            <Link href="/contact" className="ledger-button ledger-button--signal">
              프로젝트 문의하기 <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="md:col-span-4 space-y-7">
            <nav aria-label="하단 메뉴">
              <ul className="grid border-t border-neutral-950 text-sm text-neutral-800">
                <li><Link href="/about" className="inline-flex min-h-11 items-center border-b border-neutral-950 hover:bg-brand-yellow">About us</Link></li>
                <li><Link href="/projects" className="inline-flex min-h-11 items-center border-b border-neutral-950 hover:bg-brand-yellow">Projects</Link></li>
                <li><Link href="/contact" className="inline-flex min-h-11 items-center border-b border-neutral-950 hover:bg-brand-yellow">Contact</Link></li>
              </ul>
            </nav>
            <div className="space-y-1">
              <a href="mailto:contact@oppositeblue.co.kr" className="inline-flex min-h-11 items-center gap-2 text-sm text-neutral-800 underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-blue">
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" /> contact@oppositeblue.co.kr
              </a>
              <p className="text-sm text-neutral-700">Seoul, Republic of Korea</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-neutral-950 pt-5 text-xs text-neutral-700 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Image
              src="/brand/oppositeblue-square-line.png"
              alt=""
              width={900}
              height={900}
              className="h-7 w-7 shrink-0"
            />
            <p>© {new Date().getFullYear()} Opposite Blue. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/privacy" className="inline-flex min-h-11 items-center underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-blue">개인정보 처리 안내</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-blue">사이트 이용 안내</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
