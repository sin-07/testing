import { Suspense } from 'react';
import { Header, Footer } from '@/components/layout';
import RegistrationForm from './RegistrationForm';
import { getCenters } from '@/actions/registration';
import {
  Calendar,
  MapPin,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function CenterSidebar() {
  const { centers } = await getCenters();

  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0) || 80;
  const totalFilled = centers.reduce((sum, c) => sum + c.filled_count, 0);
  const availableSeats = Math.max(0, totalCapacity - totalFilled);

  return (
    <div className="space-y-6">
      {/* Schedule Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950 text-white p-6 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-semibold mb-4">
          <Clock className="w-3.5 h-3.5 text-primary-300" />
          Central Examination 2026
        </span>

        <h3 className="font-heading font-bold text-xl text-white mb-4">
          Key Examination Schedule
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 font-medium">Exam Date</p>
              <p className="font-semibold text-white text-sm">
                {process.env.NEXT_PUBLIC_EXAM_DATE || '15th March 2026'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 font-medium">Exam Shift</p>
              <p className="font-semibold text-white">10:00 AM – 1:00 PM (Reporting: 8:30 AM)</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-400 font-medium">Total Regional Seat Pool</p>
              <p className="font-semibold text-white">
                <span className="text-emerald-400 font-bold">{availableSeats}</span> seats open of {totalCapacity}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Regional Centers Gauge */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-heading font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            Live Seat Radar
          </h4>
          <span className="text-[11px] font-semibold text-slate-500 font-mono">
            {centers.length} Centers
          </span>
        </div>

        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {centers.map((center) => {
            const fillPercentage = Math.round((center.filled_count / center.capacity) * 100);
            const isFull = center.filled_count >= center.capacity;
            const openSeats = Math.max(0, center.capacity - center.filled_count);

            return (
              <div
                key={center.id}
                className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-800">{center.name}</span>
                  <span
                    className={`font-semibold ${
                      isFull
                        ? 'text-rose-600'
                        : openSeats <= 2
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {isFull ? 'Full (0)' : `${openSeats} left`}
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

      {/* Smart Proximity Rule Box */}
      <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200/70 p-4 text-xs text-indigo-900 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-indigo-950 font-heading">
          <Compass className="w-4 h-4 text-indigo-600" />
          Nearest-Neighbor Fallback
        </div>
        <p className="leading-relaxed text-indigo-800 font-light">
          If your selected preferred center hits its 8-student cap before your request finishes, our
          concurrency engine will allot you to the closest neighboring center automatically.
        </p>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Page Banner */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-2 font-heading">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              Online Registration
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Candidate Examination Application
            </h1>
            <p className="text-slate-600 text-sm mt-2">
              Fill in your details below to reserve your exam seat and generate your official Admit Card.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <Suspense
                fallback={
                  <div className="rounded-3xl bg-white p-8 border border-slate-200 text-center text-sm text-slate-500">
                    Loading regional center availability...
                  </div>
                }
              >
                <CenterSidebar />
              </Suspense>
            </div>

            {/* Right Registration Wizard */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <Suspense
                fallback={
                  <div className="rounded-3xl bg-white p-8 border border-slate-200 text-center text-sm text-slate-500">
                    Loading registration form...
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
