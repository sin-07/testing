/**
 * National Testing Agency (NTA) Official Portal Footer
 * Authentic Government of India / NIC layout with candidate support,
 * accessibility compliance (WCAG 2.1), and examination center directory
 */

import Link from 'next/link';
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';
import { EXAM_CENTERS } from '@/lib/types';
import { TricolorBar, AshokaEmblem } from '@/components/ui/NtaLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071527] text-slate-400 border-t border-slate-800 mt-auto">
      <TricolorBar />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Col 1: Official Agency Overview */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5 text-white">
              <AshokaEmblem className="w-8 h-8 shrink-0" color="#f8fafc" />
              <div>
                <h4 className="font-bold text-sm tracking-tight text-white font-heading">
                  National Testing Agency (NTA)
                </h4>
                <p className="text-[10px] text-slate-400">राष्ट्रीय परीक्षा एजेंसी • Govt. of India</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              An autonomous and self-sustained premier testing organization established by the Ministry of Education to conduct entrance examinations for admissions into premier higher educational institutions.
            </p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-200 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Smart Proximity Allocation Engine (Active)</span>
            </div>
          </div>

          {/* Col 2: Candidate Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Candidate Services / सेवाएं
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px]">
              <li>
                <Link href="/apply" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→ Online Registration (Session 1)</span>
                </Link>
              </li>
              <li>
                <Link href="/admit-card" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→ Download Admit Card / Hall Ticket</span>
                </Link>
              </li>
              <li>
                <Link href="/admit-card?tab=find" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→ Recover Application / Roll Number</span>
                </Link>
              </li>
              <li>
                <Link href="/#radar" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→ Live Center Seat Radar</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>→ Central Examination Control Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Examination Centers (Bihar Zone) */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              Exam Centers / परीक्षा केंद्र (10)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {EXAM_CENTERS.map((center) => (
                <span
                  key={center}
                  className="text-[10px] bg-slate-800/90 text-slate-200 border border-slate-700/60 px-2 py-0.5 rounded"
                >
                  {center}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2.5">
              Cap: 8 candidates/center • Automated nearest-neighbor routing on overflow.
            </p>
          </div>

          {/* Col 4: National Helpdesk */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3.5 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              NTA Candidate Helpdesk
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                <p className="text-slate-400 text-[10px]">Toll-Free Helpline:</p>
                <p className="text-white font-mono font-bold text-xs">011-40759000 / 011-69227700</p>
              </div>
              <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                <p className="text-slate-400 text-[10px]">Email Support:</p>
                <p className="text-amber-300 font-mono text-xs">jeemain@nta.ac.in</p>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Timing: 10:00 AM to 05:00 PM (Monday to Saturday, except Gazetted Holidays)
              </p>
            </div>
          </div>
        </div>

        {/* Official Statutory Links */}
        <div className="py-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="hover:text-slate-200 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Hyperlink Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">RTI</span>
          </div>

          <div className="text-[10px] text-slate-400">
            W3C WCAG 2.1 Compliant • 256-Bit SSL Encryption
          </div>
        </div>

        {/* NIC & Govt Accreditation Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {currentYear} National Testing Agency (NTA). Joint Entrance Examination (Main) - 2026.</p>
          <p className="text-[10px]">
            Designed & Hosted for JEE (Main) 2026 Regional Allocation by <strong className="text-slate-300 font-semibold">NIC & NTA</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
