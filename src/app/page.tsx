import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import HomeCenterRadar from '@/components/home/HomeCenterRadar';
import { getCenters } from '@/actions/registration';
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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const centersResult = await getCenters();
  const centers = centersResult.success ? centersResult.centers : [];

  const totalCapacity = centers.reduce((acc, c) => acc + c.capacity, 0) || 80;
  const totalFilled = centers.reduce((acc, c) => acc + c.filled_count, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalFilled);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-12 pb-24 md:pt-20 md:pb-32">
          {/* Subtle glowing ambient spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-10 right-10 w-[300px] h-[300px] bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-primary-200 mb-6 animate-fadeIn">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Academic Session 2026 • Automated Regional Allotment</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] mb-6 animate-slideUp">
                Smart Examination <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300">
                  Center Allotment Portal
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                Register seamlessly for your centralized examination. Our intelligent engine
                allocates your preferred regional center or seamlessly routes to the nearest available
                center with instant Admit Card issuance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  href="/apply"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Candidate Registration
                </Link>

                <Link
                  href="/admit-card"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-semibold text-slate-100 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Download className="w-4 h-4 text-primary-300" />
                  Download Admit Card
                </Link>
              </div>

              {/* Quick Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 max-w-3xl mx-auto">
                <div className="p-3 text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-white">10</div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                    Exam Centers
                  </div>
                </div>
                <div className="p-3 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-emerald-400">
                    {totalAvailable} / {totalCapacity}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                    Seats Available
                  </div>
                </div>
                <div className="p-3 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-blue-400">100%</div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                    Smart Proximity
                  </div>
                </div>
                <div className="p-3 text-center border-l border-white/10">
                  <div className="text-2xl sm:text-3xl font-bold font-heading text-purple-400">Instant</div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                    Admit Card PDF
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-slate-50 [clip-path:polygon(0_100%,100%_100%,100%_0%,0_100%)]"></div>
        </section>

        {/* LIVE CENTER RADAR SECTION */}
        <section className="py-16 sm:py-24 bg-slate-50 relative">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/70 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
                  <MapPin className="w-3.5 h-3.5" />
                  Live Regional Availability
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                  Regional Center Radar
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-xl">
                  Inspect real-time seat availability across all 10 Bihar examination centers.
                  Pre-select your preferred center to begin registration.
                </p>
              </div>

              <Link
                href="/apply"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 group shrink-0"
              >
                <span>Reserve Seat in Selected Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Interactive Radar */}
            <HomeCenterRadar initialCenters={centers} />
          </div>
        </section>

        {/* HOW SMART ALLOTMENT WORKS */}
        <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 font-heading">
                Automated Allocation Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight mt-2">
                How Center Allotment Works
              </h2>
              <p className="text-slate-600 text-sm mt-3">
                Built to guarantee fair, transparent, and geographically optimal placement for every candidate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary-700 flex items-center justify-center font-bold text-lg mb-6">
                    1
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Submit Application
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide basic personal information, date of birth, and select your preferred
                    examination center from the 10 available regional centers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Instant validation check
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-6">
                    2
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Smart Proximity Engine
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    If your preferred center has capacity, your seat is locked immediately. If it reaches
                    capacity (8/8), our engine uses a distance matrix to automatically assign the nearest available center.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Compass className="w-4 h-4 text-primary-500" />
                  Inter-city distance matrix
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg mb-6">
                    3
                  </div>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                    Admit Card Generation
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your unique Roll Number is generated instantly. Download your official Admit Card
                    complete with venue address, reporting schedule, invigilator QR code, and security watermark.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FileCheck2 className="w-4 h-4 text-purple-500" />
                  A4 Print-ready PDF & QR
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECURITY & TRUST BANNER */}
        <section className="py-16 bg-gradient-to-r from-primary-900 via-indigo-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Enterprise Grade Integrity
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight mb-4">
                  Concurrency-Safe & Zero Overbooking
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
                  Our MongoDB engine enforces strict atomic increments and conditional bounds.
                  Even with hundreds of simultaneous candidate submissions, no examination center can exceed
                  its designated seat capacity of 8 students.
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Atomic Conditional Mutations
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Automated Distance Routing
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Tamper-proof Cryptographic QR
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/15">
                <h3 className="font-heading font-bold text-lg mb-2 text-white">
                  Have You Already Registered?
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Quickly download your admit card or retrieve forgotten registration details.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/admit-card"
                    className="flex-1 btn btn-primary py-3 text-xs text-center"
                  >
                    Download Admit Card
                  </Link>
                  <Link
                    href="/admit-card?tab=find"
                    className="flex-1 px-4 py-3 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 text-center transition-colors"
                  >
                    Find My Roll Number
                  </Link>
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
