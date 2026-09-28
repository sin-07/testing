import { Suspense } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import RegistrationForm from './RegistrationForm';
import { getCenters } from '@/actions/registration';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  PhoneCall,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function CenterSidebar() {
  const { centers } = await getCenters();

  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0) || 80;
  const totalFilled = centers.reduce((sum, c) => sum + c.filled_count, 0);
  const availableSeats = Math.max(0, totalCapacity - totalFilled);

  return (
    <div className="space-y-6">
      {/* 1. Official Examination Schedule Card */}
      <div className="rounded-3xl bg-[#0a2540] text-white p-6 shadow-xl border border-blue-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3 border border-white/15">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          JEE (Main) 2026 Session 1
        </span>

        <h3 className="font-heading font-bold text-lg text-white mb-4">
          Examination Schedule & Timings
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 font-medium">Date of Examination</p>
              <p className="font-bold text-white text-sm">15th March 2026 (Sunday)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 font-medium">Shift 1 (Morning)</p>
              <p className="font-semibold text-white">09:00 AM – 12:00 Noon</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Reporting Time: 07:30 AM IST (Gate Closes: 08:30 AM)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-300 font-medium">Regional Seat Availability</p>
              <p className="font-semibold text-white">
                <span className="text-emerald-400 font-bold text-sm">{availableSeats}</span> seats open of {totalCapacity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Regional Centers Seat Radar */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-700" />
            Live Center Seat Radar
          </h4>
          <span className="text-[11px] font-semibold text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
            {centers.length} Centers
          </span>
        </div>

        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {centers.map((center) => {
            const fillPercentage = Math.round((center.filled_count / center.capacity) * 100);
            const isFull = center.filled_count >= center.capacity;
            const openSeats = Math.max(0, center.capacity - center.filled_count);

            return (
              <div
                key={center.id}
                className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800">
                    {center.name}{' '}
                    <span className="text-[10px] text-slate-400 font-mono font-normal">({center.code})</span>
                  </span>
                  <span
                    className={`font-bold text-[11px] ${
                      isFull
                        ? 'text-rose-600'
                        : openSeats <= 2
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {isFull ? 'Full (0)' : `${openSeats} open`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull
                        ? 'bg-rose-500'
                        : fillPercentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, fillPercentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. NTA Smart Proximity Allocation Protocol */}
      <div className="rounded-2xl bg-blue-50/80 border border-blue-200/90 p-4 text-xs text-blue-950 space-y-2">
        <div className="flex items-center gap-2 font-bold font-heading text-blue-900">
          <Compass className="w-4 h-4 text-primary-600" />
          Smart Proximity Allocation Protocol
        </div>
        <p className="leading-relaxed text-blue-900/90 text-[11px]">
          Seats are strictly capped at 8 candidates per examination center to ensure zero-compromise exam integrity. If your 1st Choice center fills to maximum capacity, our algorithmic proximity engine automatically assigns you to the closest neighboring center in Bihar with zero rejection.
        </p>
      </div>

      {/* 4. Candidate Helpline Box */}
      <div className="rounded-2xl bg-slate-100 p-4 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <PhoneCall className="w-4 h-4 text-primary-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900">NTA Candidate Helpdesk:</strong>
          <span>Phone: 011-40759000 | Email: jeemain@nta.ac.in</span>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fa]">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Breadcrumb Bar */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link href="/" className="hover:text-primary-700">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold">JEE (Main) 2026 Online Application</span>
          </div>

          {/* Official Candidate Advisory Banner */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-bold text-amber-900 block mb-0.5">
                IMPORTANT ADVISORY FOR CANDIDATES (JEE MAIN 2026):
              </strong>
              Please keep your Class 10th certificate, Aadhaar/Identity card, and choice of 4 Bihar examination cities ready before filling the form. Allotment is processed concurrently and authenticated with cryptographic roll number generation.
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Live Radar & Timetable */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <Suspense
                fallback={
                  <div className="rounded-3xl bg-white p-8 border border-slate-200 text-center text-xs text-slate-500">
                    Loading examination center availability...
                  </div>
                }
              >
                <CenterSidebar />
              </Suspense>
            </div>

            {/* Right Main Application Wizard */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <Suspense
                fallback={
                  <div className="rounded-3xl bg-white p-8 border border-slate-200 text-center text-xs text-slate-500">
                    Loading application wizard...
                  </div>
                }
              >
                <RegistrationForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
