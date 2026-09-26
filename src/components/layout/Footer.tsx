/**
 * Enhanced Footer Component
 * Provides comprehensive portal resources, regional centers overview, and candidate helpline
 */

import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EXAM_CENTERS } from '@/lib/types';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                CenterAllot
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated examination management and smart regional center allotment engine.
              Ensuring fair, transparent, and proximity-optimized seat distribution across Bihar.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Proximity Routing Active</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading">
              Candidate Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/apply"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary-400" />
                  New Registration
                </Link>
              </li>
              <li>
                <Link
                  href="/admit-card"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Download Admit Card
                </Link>
              </li>
              <li>
                <Link
                  href="/admit-card?tab=find"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Find My Roll Number
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 10 Exam Centers */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-400" />
              Regional Centers (10)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {EXAM_CENTERS.map((center) => (
                <span
                  key={center}
                  className="text-xs bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded-md"
                >
                  {center}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              Fixed capacity: 8 students / center. Max total capacity: 80 students.
            </p>
          </div>

          {/* Support & Helpline */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase font-heading flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Candidate Helpline
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              For registration issues, center inquiries, or admit card support:
            </p>
            <div className="space-y-2 text-sm">
              <div className="text-slate-200 font-mono text-xs bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                Toll Free: 1800-345-2026
              </div>
              <div className="text-slate-200 font-mono text-xs bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                Email: support@examportal.gov.in
              </div>
              <p className="text-[11px] text-slate-500">
                Operating Hours: Mon - Sat, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Examination Management System. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js & MongoDB</span>
            <span>•</span>
            <span className="text-slate-400">Strict Seat Allocation Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
