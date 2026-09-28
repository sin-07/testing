'use client';

/**
 * National Testing Agency (NTA) Official Header
 * High-definition government portal branding with national tricolor stripe,
 * bilingual typography, accessibility sizing, and live notice ticker
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  NtaLogoBadge,
  TricolorBar,
} from '@/components/ui/NtaLogo';
import {
  Home,
  UserPlus,
  FileText,
  ShieldAlert,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  HelpCircle,
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'small'>('normal');
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', hindiLabel: 'मुख्य पृष्ठ', icon: Home },
    { href: '/apply', label: 'Candidate Registration', hindiLabel: 'ऑनलाइन आवेदन', icon: UserPlus, highlight: true },
    { href: '/admit-card', label: 'Admit Card / Hall Ticket', hindiLabel: 'प्रवेश पत्र', icon: FileText },
    { href: '/#radar', label: 'Live Center Radar', hindiLabel: 'केंद्र स्थिति', icon: MapPin },
    { href: '/admin', label: 'Official Portal', hindiLabel: 'प्रशासनिक लॉगिन', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* 1. Indian National Tricolor Ribbon */}
      <TricolorBar />

      {/* 2. Top Ministry & Accessibility Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          {/* Left: Ministry Identification */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="font-semibold text-amber-400">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="font-medium text-slate-300">Government of India</span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-400">Department of Higher Education, Ministry of Education</span>
          </div>

          {/* Right: Helpdesk & Accessibility */}
          <div className="flex items-center gap-3 sm:gap-5 text-[11px]">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Helpline: <strong className="text-white font-mono">011-40759000</strong></span>
            </div>

            {/* Accessibility Font Resizer */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 mr-1">Font:</span>
              <button
                type="button"
                onClick={() => setFontSize('small')}
                className={`px-1 rounded text-[10px] hover:text-white ${fontSize === 'small' ? 'bg-primary-600 text-white font-bold' : 'text-slate-400'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-1 rounded text-[11px] hover:text-white ${fontSize === 'normal' ? 'bg-primary-600 text-white font-bold' : 'text-slate-400'}`}
                title="Normal font size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-1 rounded text-[12px] hover:text-white ${fontSize === 'large' ? 'bg-primary-600 text-white font-bold' : 'text-slate-400'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[10px]">Server: Active (0ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main NTA Identity Bar */}
      <div className="py-2.5 sm:py-3.5 px-4 bg-white">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo & Agency Branding */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
            <NtaLogoBadge />
            <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="hidden md:block">
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-heading leading-tight flex items-center gap-2">
                <span>JEE (Main) 2026</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Session 1 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Centralized Regional Examination Center Allotment Portal
              </p>
            </div>
          </Link>

          {/* Quick Support Badge */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                <span>Academic Session 2026</span>
              </div>
              <p className="text-[10px] text-slate-500">Exam Date: 15 March 2026</p>
            </div>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 via-primary-700 to-indigo-800 text-white font-semibold text-xs shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Apply Online / पंजीकरण</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-primary-700 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 4. Secondary Portal Navigation Tabs */}
      <div className="bg-[#0b1f3a] text-white border-t border-blue-950/50">
        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all ${
                    isActive
                      ? 'border-amber-400 bg-white/10 text-amber-300'
                      : 'border-transparent text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div className="flex flex-col text-left">
                    <span>{link.label}</span>
                    <span className="text-[9px] font-normal text-slate-400 leading-none">{link.hindiLabel}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Live Notice Ticker for desktop */}
          <div className="hidden xl:flex items-center gap-2 py-1.5 text-[11px] text-amber-200 overflow-hidden max-w-md">
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[9px] uppercase tracking-wider shrink-0 animate-pulse">
              NEW
            </span>
            <span className="truncate">
              Smart Proximity Allotment active across 10 regional Bihar centers.
            </span>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-2 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-primary-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-semibold">{link.label}</p>
                      <p className="text-xs text-slate-400">{link.hindiLabel}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/apply"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-center flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                Fill Application Form / आवेदन पत्र
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
