'use client';

/**
 * Premium Navigation Header Component
 * Glassmorphic styling, active route indicator, live exam portal status pill
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  GraduationCap,
  ClipboardList,
  FileCheck2,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: any;
}

interface HeaderProps {
  links?: NavLink[];
  showAdminLink?: boolean;
}

export default function Header({ links, showAdminLink = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks: NavLink[] = [
    { href: '/', label: 'Overview', icon: GraduationCap },
    { href: '/apply', label: 'Candidate Registration', icon: ClipboardList },
    { href: '/admit-card', label: 'Admit Card', icon: FileCheck2 },
    ...(showAdminLink ? [{ href: '/admin', label: 'Admin Portal', icon: ShieldCheck }] : []),
  ];

  const navLinks = links && links.length > 0 ? links : defaultLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-100 py-3.5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo & Portal Branding */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
                  CenterAllot
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  2026 LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Smart Exam Center Allotment Portal
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm shadow-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-sm hover:shadow-primary-500/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply Online
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pt-3 border-t border-slate-100 space-y-1 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/apply"
                className="w-full btn btn-primary py-2.5 text-xs text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Apply Online Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
