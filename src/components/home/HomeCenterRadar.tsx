'use client';

/**
 * Interactive Center Radar for Landing Page
 * Allows candidates to view all 10 Bihar centers, search by city, and check capacity
 */

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CENTER_METADATA_LIST } from '@/lib/proximity';

interface CenterData {
  id: string;
  name: string;
  code: string;
  location: string;
  city: string;
  capacity: number;
  filled_count: number;
  available: number;
  isFull: boolean;
  occupancyRate?: number;
}

interface HomeCenterRadarProps {
  initialCenters?: CenterData[];
}

export default function HomeCenterRadar({ initialCenters = [] }: HomeCenterRadarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'full'>('all');

  // Merge static metadata with dynamic centers if provided
  const centers = CENTER_METADATA_LIST.map((meta) => {
    const live = initialCenters.find((c) => c.name.toLowerCase() === meta.name.toLowerCase());
    const capacity = live?.capacity || meta.capacity || 8;
    const filled = live?.filled_count || 0;
    const available = Math.max(0, capacity - filled);
    const isFull = available === 0;

    return {
      id: meta.id,
      name: meta.name,
      code: meta.code,
      location: meta.location,
      landmark: meta.landmark,
      city: meta.city,
      capacity,
      filled_count: filled,
      available,
      isFull,
      occupancyRate: Math.round((filled / capacity) * 100),
      amenities: meta.amenities,
    };
  });

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'available') return !center.isFull;
    if (filter === 'full') return center.isFull;
    return true;
  });

  return (
    <div className="w-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search center by city or code (e.g. Patna, PAT-01)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-medium w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Centers ({centers.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              filter === 'available'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available ({centers.filter((c) => !c.isFull).length})
          </button>
          <button
            onClick={() => setFilter('full')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all ${
              filter === 'full'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full ({centers.filter((c) => c.isFull).length})
          </button>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className={`group rounded-2xl border p-5 transition-all duration-300 relative flex flex-col justify-between ${
              center.isFull
                ? 'bg-slate-50/70 border-slate-200'
                : 'bg-white hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 border-slate-200/90'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      center.isFull
                        ? 'bg-slate-200 text-slate-600'
                        : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-200'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base group-hover:text-primary-600 transition-colors">
                      {center.name}
                    </h3>
                    <span className="font-mono text-xs font-medium text-slate-500">
                      {center.code}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    center.isFull
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : center.available <= 2
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      center.isFull
                        ? 'bg-rose-500'
                        : center.available <= 2
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  ></span>
                  {center.isFull
                    ? 'Full (Overflow Active)'
                    : `${center.available} Seats Open`}
                </span>
              </div>

              {/* Location details */}
              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{center.location}</span>
              </p>

              {/* Capacity meter */}
              <div className="space-y-1.5 mb-5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Occupancy</span>
                  <span>
                    {center.filled_count} / {center.capacity} Students ({center.occupancyRate}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      center.isFull
                        ? 'bg-rose-500'
                        : center.occupancyRate >= 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, center.occupancyRate)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {center.isFull
                  ? 'Auto nearest-center routing'
                  : 'Instant confirmation ready'}
              </span>

              <Link
                href={`/apply?center=${encodeURIComponent(center.name)}`}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  center.isFull
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white'
                }`}
              >
                Select
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
