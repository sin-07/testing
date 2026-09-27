'use client';

/**
 * Supercharged Admin Students Management Page
 * Features:
 * - Real-time filtering across name, roll no, email, mobile, center
 * - Filter by "Proximity Re-allocated" candidates
 * - Direct Center Re-assignment Tool for candidates
 * - Candidate Registration Deletion (with seat release)
 * - 1-Click Export to CSV File
 * - Quick Admit Card Verification Shortcut
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getAllStudents,
  getCenterStats,
  reassignStudentCenter,
  deleteStudentRegistration,
} from '@/actions/admin';
import { StudentWithCenter, Center } from '@/lib/types';
import { EXAM_CENTERS } from '@/lib/types';
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Compass,
  ArrowRight,
  ArrowLeft,
  Trash2,
  RefreshCw,
  Edit,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<
    (StudentWithCenter & {
      was_reallocated?: boolean;
      preferred_center?: string;
      reallocation_reason?: string;
    })[]
  >([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenterFilter, setSelectedCenterFilter] = useState('ALL');
  const [onlyReallocated, setOnlyReallocated] = useState(false);
  const [actionAlert, setActionAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Re-allocation modal state
  const [reassignModalStudent, setReassignModalStudent] = useState<any | null>(null);
  const [targetCenterName, setTargetCenterName] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  // Deletion modal state
  const [deleteModalStudent, setDeleteModalStudent] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, centersRes] = await Promise.all([
        getAllStudents(),
        getCenterStats(),
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.students);
      }
      if (centersRes.centers) {
        setCenters(centersRes.centers);
      }
    } catch (err) {
      console.error('Error loading students data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      student.name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term) ||
      student.mobile.includes(term) ||
      (student.roll_no && student.roll_no.toLowerCase().includes(term)) ||
      student.selected_center.toLowerCase().includes(term) ||
      (student.allotted_center && student.allotted_center.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    if (selectedCenterFilter !== 'ALL') {
      if (student.allotted_center !== selectedCenterFilter) return false;
    }

    if (onlyReallocated && !student.was_reallocated) {
      return false;
    }

    return true;
  });

  // Re-assign center handler
  const handleExecuteReassign = async () => {
    if (!reassignModalStudent || !targetCenterName) return;
    setIsReassigning(true);
    setActionAlert(null);

    try {
      const res = await reassignStudentCenter(reassignModalStudent.id, targetCenterName);
      if (res.success) {
        setActionAlert({ type: 'success', message: res.message });
        setReassignModalStudent(null);
        await loadData();
      } else {
        setActionAlert({ type: 'error', message: res.message });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: 'Failed to re-assign center.' });
    } finally {
      setIsReassigning(false);
    }
  };

  // Delete student handler
  const handleExecuteDelete = async () => {
    if (!deleteModalStudent) return;
    setIsDeleting(true);
    setActionAlert(null);

    try {
      const res = await deleteStudentRegistration(deleteModalStudent.id);
      if (res.success) {
        setActionAlert({ type: 'success', message: res.message });
        setDeleteModalStudent(null);
        await loadData();
      } else {
        setActionAlert({ type: 'error', message: res.message });
      }
    } catch (err) {
      setActionAlert({ type: 'error', message: 'Failed to delete registration.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Export CSV handler
  const handleExportCSV = () => {
    if (students.length === 0) return;

    const headers = [
      'Roll Number',
      'Name',
      'Email',
      'Mobile',
      'Date of Birth',
      'Selected Center',
      'Allotted Center',
      'Re-allocated',
      'Registration Date',
    ];

    const rows = filteredStudents.map((s) => [
      s.roll_no || '',
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.mobile,
      s.dob,
      `"${s.selected_center}"`,
      `"${s.allotted_center || ''}"`,
      s.was_reallocated ? 'YES' : 'NO',
      s.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Candidate_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
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
            <span className="text-xs font-semibold text-primary-600">Candidate Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
            Registered Candidates
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Total of {students.length} candidates registered across all 10 centers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-secondary py-2 px-3.5 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV ({filteredStudents.length})
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={loadData}
            className="btn btn-secondary p-2.5 text-slate-600 hover:text-slate-900"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionAlert && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn ${
            actionAlert.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionAlert.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{actionAlert.message}</span>
          </div>
          <button onClick={() => setActionAlert(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, email, mobile, or center..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Center filter dropdown */}
            <select
              value={selectedCenterFilter}
              onChange={(e) => setSelectedCenterFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="ALL">All Centers (10)</option>
              {EXAM_CENTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Toggle for reallocated candidates */}
            <button
              type="button"
              onClick={() => setOnlyReallocated(!onlyReallocated)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 shrink-0 ${
                onlyReallocated
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Alternate Only</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
          <span>
            Showing <strong>{filteredStudents.length}</strong> of {students.length} candidates
          </span>
          {(searchTerm || selectedCenterFilter !== 'ALL' || onlyReallocated) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCenterFilter('ALL');
                setOnlyReallocated(false);
              }}
              className="text-primary-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Candidate Details</th>
                <th>Contact</th>
                <th>Preferred Center</th>
                <th>Allotted Center</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-sm">
                    {searchTerm
                      ? 'No candidate records matched your search query.'
                      : 'No candidate registrations recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2.5 py-1 rounded-md border border-slate-200">
                        {student.roll_no || 'PENDING'}
                      </span>
                    </td>

                    <td>
                      <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                      <span className="text-[11px] text-slate-500">
                        DOB: {new Date(student.dob).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td>
                      <div className="text-xs text-slate-800">{student.email}</div>
                      <div className="text-[11px] font-mono text-slate-500">+91 {student.mobile}</div>
                    </td>

                    <td>
                      <span className="text-xs text-slate-700 font-medium">
                        {student.selected_center}
                      </span>
                    </td>

                    <td>
                      <div className="font-semibold text-slate-900 text-xs">
                        {student.allotted_center || 'Unassigned'}
                      </div>
                      {student.was_reallocated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5">
                          <Compass className="w-3 h-3 text-amber-600" />
                          Proximity Routed
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                        Confirmed
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Re-assign Center */}
                        <button
                          type="button"
                          onClick={() => {
                            setReassignModalStudent(student);
                            setTargetCenterName(student.allotted_center || 'Patna');
                          }}
                          className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Transfer / Reassign Center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Student */}
                        <button
                          type="button"
                          onClick={() => setDeleteModalStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RE-ASSIGNMENT MODAL */}
      {reassignModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Transfer Candidate Center
              </h3>
              <button
                onClick={() => setReassignModalStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1">
              <div>
                Candidate: <strong>{reassignModalStudent.name}</strong> ({reassignModalStudent.roll_no})
              </div>
              <div>
                Currently Allotted: <strong>{reassignModalStudent.allotted_center}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Destination Center:
              </label>
              <select
                value={targetCenterName}
                onChange={(e) => setTargetCenterName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500/20"
              >
                {centers.map((c) => {
                  const isCurrent = c.name === reassignModalStudent.allotted_center;
                  const isFull = c.filled_count >= c.capacity;
                  return (
                    <option
                      key={c.id}
                      value={c.name}
                      disabled={isCurrent || isFull}
                    >
                      {c.name} ({c.capacity - c.filled_count} seats left) {isCurrent ? '- (Current)' : isFull ? '- (FULL)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReassignModalStudent(null)}
                className="flex-1 btn btn-secondary py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReassigning}
                onClick={handleExecuteReassign}
                className="flex-1 btn btn-primary py-2.5 text-xs font-semibold"
              >
                {isReassigning ? 'Transferring...' : 'Confirm Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETION CONFIRMATION MODAL */}
      {deleteModalStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Cancel Registration?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <strong>{deleteModalStudent.name}</strong> ({deleteModalStudent.roll_no})?
                This will release their seat in {deleteModalStudent.allotted_center}.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalStudent(null)}
                className="flex-1 btn btn-secondary py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="flex-1 btn btn-danger py-2.5 text-xs font-semibold"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
