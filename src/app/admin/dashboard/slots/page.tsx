/**
 * Center-wise Allocation Page
 * Shows students grouped by their allotted exam centers with proximity tracking
 */

import { getCenterStats, getAllStudents } from '@/actions/admin';
import { MapPin, Users, Building, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CentersPage() {
  const stats = await getCenterStats();
  const { students } = await getAllStudents();

  // Group students by center name
  const centerStudentMap = new Map<string, typeof students>();

  stats.centers.forEach((center) => {
    centerStudentMap.set(center.name, []);
  });

  students.forEach((student) => {
    const centerName = student.allotted_center || 'Unassigned';
    const centerStudents = centerStudentMap.get(centerName) || [];
    centerStudents.push(student);
    centerStudentMap.set(centerName, centerStudents);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-primary-600">Center Allocations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
            Regional Center Allocation Roster
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            View enrolled candidates categorized by their assigned physical exam venue.
          </p>
        </div>

        <Link
          href="/admin/dashboard/students"
          className="btn btn-secondary py-2 px-4 text-xs font-semibold"
        >
          View All Students Directory
        </Link>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center p-5">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-primary-600">
            {stats.totalCenters}
          </p>
          <p className="text-slate-500 text-xs mt-1 uppercase font-semibold tracking-wider">
            Total Centers
          </p>
        </div>
        <div className="card text-center p-5">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-600">
            {stats.totalFilled}
          </p>
          <p className="text-slate-500 text-xs mt-1 uppercase font-semibold tracking-wider">
            Candidates Placed
          </p>
        </div>
        <div className="card text-center p-5">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-indigo-600">
            {stats.totalCapacity}
          </p>
          <p className="text-slate-500 text-xs mt-1 uppercase font-semibold tracking-wider">
            Total Seat Cap
          </p>
        </div>
        <div className="card text-center p-5">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-600">
            {stats.availableSeats}
          </p>
          <p className="text-slate-500 text-xs mt-1 uppercase font-semibold tracking-wider">
            Available Seats
          </p>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid gap-6">
        {stats.centers.map((center) => {
          const centerStudents = centerStudentMap.get(center.name) || [];
          const fillPercentage = Math.round((center.filled_count / center.capacity) * 100);
          const isFull = center.filled_count >= center.capacity;

          return (
            <div key={center.id} className="card p-6 shadow-sm border border-slate-200/80">
              {/* Center Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isFull ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900">
                        {center.name}
                      </h2>
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {center.code || 'CEN-01'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {center.location || 'Central Examination Hub'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 font-mono">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>
                      {center.filled_count} / {center.capacity} Seats
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : fillPercentage >= 75
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isFull ? 'Full (0 Open)' : `${fillPercentage}% Filled`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
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

              {/* Students Table */}
              {centerStudents.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 px-3">Roll No</th>
                        <th className="py-2.5 px-3">Candidate Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Mobile</th>
                        <th className="py-2.5 px-3">Allocation Origin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {centerStudents.map((student, index) => (
                        <tr
                          key={student.id}
                          className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-primary-700">
                            {student.roll_no}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{student.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{student.email}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">+91 {student.mobile}</td>
                          <td className="py-2.5 px-3">
                            {student.selected_center !== center.name ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                <Compass className="w-3 h-3 text-amber-600" />
                                Rerouted from {student.selected_center}
                              </span>
                            ) : (
                              <span className="text-slate-500 font-medium">1st Choice (Preferred)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No candidates currently assigned to this center.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
