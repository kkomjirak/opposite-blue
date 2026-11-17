'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
    <header className="sticky top-0 z-40 border-b-[3px] border-neutral-950 bg-[var(--surface-paper)]">
      <div className="ledger-shell flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-5">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} aria-label="Opposite Blue" className="inline-flex min-h-11 items-center">
            <Image
              src="/brand/oppositeblue-horizontal-colored.png"
              alt=""
              width={900}
              height={143}
              className="h-8 w-auto shrink-0 md:h-6"
              priority
            />
          </Link>
          <span className="ledger-label hidden md:inline-flex">{timeString || 'Seoul, KR'}</span>
        </div>
        <nav aria-label="주 메뉴" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center border-l border-neutral-950 px-4 text-sm transition-colors ${pathname === link.href ? 'bg-brand-yellow font-semibold text-neutral-950' : 'text-neutral-700 hover:bg-neutral-950 hover:text-white active:bg-brand-blue'}`}>
              {link.name}
            </Link>
          ))}
        </nav>
        <button ref={menuButton} type="button" onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-neutral-950 text-neutral-950 hover:bg-brand-yellow active:bg-neutral-950 active:text-white md:hidden"
          aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
          {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="모바일 메뉴" hidden={!mobileMenuOpen}
        className="ledger-shell border-t border-neutral-950 bg-[var(--surface-paper)] py-2 md:hidden">
        {[{ name: 'Home', href: '/' }, ...navLinks].map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
            aria-current={pathname === link.href ? 'page' : undefined}
            className={`flex min-h-11 items-center border-b border-neutral-950 px-2 text-base ${pathname === link.href ? 'bg-brand-yellow font-semibold text-neutral-950' : 'text-neutral-700 hover:bg-neutral-950 hover:text-white active:bg-brand-blue'}`}>
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
