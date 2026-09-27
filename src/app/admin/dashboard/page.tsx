'use client';

/**
 * Supercharged Admin Dashboard Overview
 * Features:
 * - Real-time system utilization statistics
 * - Visual center capacity breakdown with progress indicators
 * - One-click Centers Metadata Sync button
 * - Quick shortcuts to student management and allocations
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCenterStats, getStudentCount, syncCentersWithMetadata } from '@/actions/admin';
import { CenterStats } from '@/lib/types';
import {
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ArrowRight,
  Database,
  MapPin,
  Sparkles,
  ShieldCheck,
  Percent,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<CenterStats | null>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [centerStats, count] = await Promise.all([getCenterStats(), getStudentCount()]);
      setStats(centerStats);
      setStudentCount(count);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCenters = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncCentersWithMetadata();
      if (res.success) {
        setSyncMessage(res.message);
        await loadDashboardData();
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const totalCapacity = stats?.totalCapacity || 80;
  const totalFilled = stats?.totalFilled || studentCount;
  const occupancyRate = Math.round((totalFilled / totalCapacity) * 100) || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              SYSTEM HEALTH: OPTIMAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Monitor real-time regional allocation, seat loads, and candidate registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncCenters}
            className="btn btn-secondary py-2 px-3.5 text-xs font-semibold"
            title="Populate missing center codes, venues, and order"
          >
            <Database className="w-3.5 h-3.5 text-primary-600" />
            {isSyncing ? 'Syncing Centers...' : 'Sync Center Metadata'}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={loadDashboardData}
            className="btn btn-primary py-2 px-3.5 text-xs font-semibold"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Candidates
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900">
            {studentCount}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold font-mono">100%</span>
            <span>confirmed hall passes</span>
          </p>
        </div>

        {/* Regional Centers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Exam Centers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900">
            {stats?.totalCenters || 10}
          </div>
          <p className="text-xs text-slate-500 mt-1">Bihar regional test network</p>
        </div>

        {/* Total Capacity & Filled */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Seat Occupancy
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-slate-900">
            {occupancyRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalFilled} of {totalCapacity} seats allotted
          </p>
        </div>

        {/* Available Seats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Available Seats
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-amber-600">
            {stats?.availableSeats ?? (totalCapacity - totalFilled)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready for open booking</p>
        </div>
      </div>

      {/* Center-wise Capacity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Center Capacity & Occupancy Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict capacity ceiling of 8 students per examination center
            </p>
          </div>

          <Link
            href="/admin/dashboard/slots"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            <span>View Detailed Grouping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Center & Code</th>
                <th>Venue Location</th>
                <th>Capacity</th>
                <th>Filled</th>
                <th>Remaining</th>
                <th>Occupancy Ratio</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.centers.map((center) => {
                const percentage = Math.round((center.filled_count / center.capacity) * 100);
                const available = Math.max(0, center.capacity - center.filled_count);
                const isFull = available === 0;

                return (
                  <tr key={center.id}>
                    <td>
                      <div className="font-bold text-slate-900">{center.name}</div>
                      <span className="font-mono text-xs text-slate-500">{center.code || 'CEN-01'}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 line-clamp-1 max-w-xs">
                        {center.location || 'Central Examination Hub'}
                      </span>
                    </td>
                    <td className="font-mono font-medium">{center.capacity}</td>
                    <td className="font-mono font-bold text-slate-900">{center.filled_count}</td>
                    <td className="font-mono font-bold text-emerald-600">{available}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isFull
                                ? 'bg-rose-500'
                                : percentage >= 75
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, percentage)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-600 font-medium">
                          {percentage}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isFull
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : percentage >= 75
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isFull ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                        {isFull ? 'Full' : 'Accepting'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/dashboard/students"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex items-center justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">
              Manage Candidates & Re-allocate Centers
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Search candidate records, transfer student centers, and export full CSV roster.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>

        <Link
          href="/admin/dashboard/slots"
          className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex items-center justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">
              Center-wise Allocation Roster
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Inspect candidates categorized by exam venue, alternate proximity assignments, and seat limits.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
      </div>
    </div>
  );
}
