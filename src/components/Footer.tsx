import Link from 'next/link';
import { Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-neutral-50/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Big Editorial Callout */}
          <div className="md:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Websites & AI Infrastructure</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-neutral-900 leading-tight">
              Let’s create something <br />
              <span className="font-semibold text-neutral-950">extraordinary together.</span>
            </h2>
            <p className="text-base text-neutral-500 max-w-xl leading-relaxed">
              Opposite Blue는 최신 트렌드를 반영한 고성능 웹사이트 제작과 비즈니스 생산성을 혁신하는 맞춤형 AI 서비스 환경 구축을 선도합니다.
            </p>
          </div>

          {/* Quick Links & Info */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Navigation</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-600 hover:text-neutral-950 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">Contact</h3>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Mail className="w-4 h-4 text-neutral-400" />
                <a href="mailto:contact@oppositeblue.com" className="hover:text-neutral-950 underline underline-offset-4">
                  contact@oppositeblue.com
                </a>
              </div>
              <p className="text-xs text-neutral-400">Seoul, Republic of Korea</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Opposite Blue. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
