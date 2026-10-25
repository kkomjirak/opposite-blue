'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'About us', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Seoul', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    });
    const updateTime = () => setTimeString(`${formatter.format(new Date())} Seoul, KR`);
    updateTime();
    const interval = setInterval(updateTime, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = window.matchMedia('(min-width: 768px)');
    const closeOnWideScreen = () => { if (media.matches) setMobileMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    media.addEventListener('change', closeOnWideScreen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      media.removeEventListener('change', closeOnWideScreen);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-5">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="min-h-11 inline-flex items-center gap-1 text-lg font-semibold tracking-tight text-neutral-900 hover:text-brand-blue transition-colors">
            Opposite Blue<span className="text-brand-yellow font-bold" aria-hidden="true">.</span>
          </Link>
          <span className="text-xs font-mono text-neutral-600 tracking-tight">{timeString || 'Seoul, KR'}</span>
        </div>
        <nav aria-label="주 메뉴" className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}
              className={`min-h-11 inline-flex items-center relative transition-colors ${pathname === link.href ? 'text-neutral-950 font-semibold underline decoration-brand-yellow decoration-2 underline-offset-8' : 'text-neutral-600 hover:text-brand-blue'}`}>
              {link.name}
            </Link>
          ))}
        </nav>
        <button ref={menuButton} type="button" onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden inline-flex min-w-11 min-h-11 items-center justify-center rounded-lg text-neutral-800 hover:bg-neutral-100"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
          {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="모바일 메뉴" hidden={!mobileMenuOpen}
        className="md:hidden border-t border-gray-200 bg-white px-6 py-3">
        {[{ name: 'Home', href: '/' }, ...navLinks].map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
            aria-current={pathname === link.href ? 'page' : undefined}
            className={`flex min-h-11 items-center rounded-md px-2 text-base hover:bg-neutral-50 ${pathname === link.href ? 'text-brand-blue font-semibold' : 'text-neutral-700'}`}>
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
