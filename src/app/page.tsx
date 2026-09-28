import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import HomeCenterRadar from '@/components/home/HomeCenterRadar';
import { getCenters } from '@/actions/registration';
import { AshokaEmblem, TricolorBar } from '@/components/ui/NtaLogo';
import {
  GraduationCap,
  Sparkles,
  Download,
  Building2,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Compass,
  FileCheck2,
  Users2,
  Bell,
  Calendar,
  AlertCircle,
  FileText,
  PhoneCall,
  Search,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const centersResult = await getCenters();
  const centers = centersResult.success ? centersResult.centers : [];

  const totalCapacity = centers.reduce((acc, c) => acc + c.capacity, 0) || 80;
  const totalFilled = centers.reduce((acc, c) => acc + c.filled_count, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalFilled);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fa]">
      <Header />

      <main className="flex-1">
        {/* 1. Official NTA Notice Ticker */}
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-semibold border-b border-amber-500/50">
          <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded bg-rose-700 text-white font-bold text-[10px] tracking-wider uppercase animate-pulse">
                PUBLIC NOTICE
              </span>
              <span className="font-bold hidden sm:inline">JEE (Main) - 2026 Session 1:</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap text-[11px] font-medium text-slate-900 truncate">
              Online Candidate Application & Centralized Exam Center Allotment active • Proximity routing enabled for 10 regional Bihar centers • Last date of submission: 10-March-2026.
            </div>
            <Link
              href="/apply"
              className="shrink-0 text-slate-950 font-bold hover:underline hidden md:flex items-center gap-1 text-[11px]"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2. Flagship NTA Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0a2540] via-[#0d2f52] to-[#123860] text-white pt-10 pb-20 md:pt-16 md:pb-28">
          {/* Subtle glowing spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/15 blur-[130px] rounded-full pointer-events-none"></div>

          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* National Portal Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6">
                <AshokaEmblem className="w-4 h-4" color="#fcd34d" />
                <span>राष्ट्रीय परीक्षा एजेंसी • National Testing Agency (NTA)</span>
              </div>

              {/* Bilingual Headings */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-4 text-white">
                संयुक्त प्रवेश परीक्षा (मुख्य) २०२६ <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
                  Joint Entrance Examination (Main) - 2026
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Centralized examination center allotment portal for undergraduate engineering admissions.
                Featuring real-time seat reservation, nearest-neighbor proximity routing, and instant Admit Card issuance.
              </p>

              {/* Primary Call to Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-12">
                {/* Apply Button Card */}
                <Link
                  href="/apply"
                  className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold hover:brightness-105 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-800 block">
                        SESSION 1 REGISTRATION
                      </span>
                      <span className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                        Candidate Registration / आवेदन करें
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Admit Card Button Card */}
                <Link
                  href="/admit-card"
                  className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/50 text-white flex items-center justify-center shrink-0 border border-white/20">
                      <Download className="w-6 h-6 text-blue-200" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                        HALL TICKET PORTAL
                      </span>
                      <span className="text-base sm:text-lg font-black tracking-tight text-white">
                        Download Admit Card / प्रवेश पत्र
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* 4 Official Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 max-w-3xl mx-auto">
                <div className="p-2.5 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white">10</div>
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                    Regional Centers
                  </div>
                </div>
                <div className="p-2.5 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-400">
                    {totalAvailable} / {totalCapacity}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                    Seats Available
                  </div>
                </div>
                <div className="p-2.5 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-black font-heading text-amber-300">100%</div>
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                    Zero Seat Rejection
                  </div>
                </div>
                <div className="p-2.5 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-black font-heading text-blue-300">Instant</div>
                  <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider mt-0.5">
                    Confirmation Slip
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Examination Timetable & Shift Schedule */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded">
                    OFFICIAL EXAMINATION SCHEDULE
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">
                    JEE (Main) - 2026 Examination Shift Schedule
                  </h2>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Date of Examination: <strong>15th March 2026 (Sunday)</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shift 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                      SHIFT 1 (MORNING SESSION)
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">Paper 1 (B.E./B.Tech)</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-heading">
                    09:00 AM – 12:00 PM IST
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Reporting Time</span>
                      <strong className="text-amber-700 font-bold">07:30 AM IST</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Gate Closing Time</span>
                      <strong className="text-rose-700 font-bold">08:30 AM IST (Strict)</strong>
                    </div>
                  </div>
                </div>

                {/* Shift 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">
                      SHIFT 2 (AFTERNOON SESSION)
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">Paper 2A & 2B</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-heading">
                    03:00 PM – 06:00 PM IST
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Reporting Time</span>
                      <strong className="text-amber-700 font-bold">01:30 PM IST</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Gate Closing Time</span>
                      <strong className="text-rose-700 font-bold">02:30 PM IST (Strict)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Live Center Seat Radar Component */}
        <section id="radar" className="py-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <HomeCenterRadar initialCenters={centers} />
          </div>
        </section>

        {/* 5. NTA 4-Step Registration Walkthrough */}
        <section className="py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded font-heading">
                REGISTRATION WORKFLOW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 font-heading">
                How Center Allotment Works in 4 Simple Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Fill Personal Details',
                  hindi: 'व्यक्तिगत विवरण',
                  desc: 'Provide candidate identity, DOB with auto-age verification, and contact info.',
                  icon: Users2,
                },
                {
                  step: '02',
                  title: 'Select 4 Exam Cities',
                  hindi: '४ परीक्षा केंद्र प्राथमिकता',
                  desc: 'Choose your 1st preference. Our proximity engine auto-suggests nearest alternatives.',
                  icon: Compass,
                },
                {
                  step: '03',
                  title: 'Smart Allocation Lock',
                  hindi: 'त्वरित सीट आवंटन',
                  desc: 'Thread-safe atomic seat allocation locks your preferred or nearest center instantly.',
                  icon: Zap,
                },
                {
                  step: '04',
                  title: 'Admit Card Generated',
                  hindi: 'प्रवेश पत्र डाउनलोड',
                  desc: 'Receive confirmation slip and printable Admit Card with QR verification code.',
                  icon: FileCheck2,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary-700 flex items-center justify-center font-black group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xl font-black text-slate-300 group-hover:text-primary-600 transition-colors">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold mb-2">{item.hindi}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Candidate Advisory & FAQ Banner */}
        <section className="py-10 px-4 sm:px-6 bg-slate-100/70 border-t border-slate-200">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded">
                  IMPORTANT GUIDELINES
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-2 mb-3">
                  Instructions for Examination Day
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bring printed copy of the Admit Card along with 1 passport size photograph.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Carry original Authorized Photo ID (Aadhaar Card, Passport, or Voter ID).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>No candidate shall be permitted to enter the examination center after Gate Closing Time (08:30 AM).</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-[#0a2540] text-white space-y-4">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-base text-white">NTA 24x7 Candidate Helpline</h4>
                    <p className="text-xs text-slate-300">National Testing Agency, New Delhi</p>
                  </div>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  For queries related to exam city allotment, application number recovery, or technical assistance:
                </div>
                <div className="pt-2 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono">
                  <span>Tel: 011-40759000</span>
                  <span>Email: jeemain@nta.ac.in</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
