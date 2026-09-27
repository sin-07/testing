'use client';

/**
 * Supercharged Admit Card Verification & Retrieval Form
 * Supports both Roll Number verification and "Find by Mobile/Email" retrieval
 */

import { useState } from 'react';
import { getAdmitCard } from '@/actions/admit-card';
import { findStudentRollNumber } from '@/actions/registration';
import { AdmitCardData } from '@/lib/types';
import AdmitCardDisplay from './AdmitCardDisplay';
import {
  FileCheck2,
  Calendar,
  Search,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function AdmitCardForm() {
  const [activeTab, setActiveTab] = useState<'verify' | 'find'>('verify');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [admitCardData, setAdmitCardData] = useState<AdmitCardData | null>(null);

  // Form states
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');

  // Lookup state
  const [findIdentifier, setFindIdentifier] = useState('');
  const [findDob, setFindDob] = useState('');
  const [foundStudent, setFoundStudent] = useState<{
    name: string;
    roll_no: string;
    allotted_center: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rollNumber.trim() || !dob) {
      setAlert({
        type: 'error',
        message: 'Please enter both your Roll Number and Date of Birth.',
      });
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const result = await getAdmitCard(rollNumber.trim(), dob);

      if (result.success && result.data) {
        setAdmitCardData(result.data);
      } else {
        setAlert({
          type: 'error',
          message:
            result.message ||
            'No matching admit card found. Please verify your roll number and date of birth.',
        });
      }
    } catch (err) {
      console.error('Admit card fetch error:', err);
      setAlert({
        type: 'error',
        message: 'A network or server error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findIdentifier.trim() || !findDob) {
      setAlert({
        type: 'error',
        message: 'Please enter your registered Email or Mobile and Date of Birth.',
      });
      return;
    }

    setIsSearching(true);
    setAlert(null);
    setFoundStudent(null);

    try {
      const res = await findStudentRollNumber(findIdentifier.trim(), findDob);
      if (res.success && res.student) {
        setFoundStudent(res.student);
        setRollNumber(res.student.roll_no);
        setDob(findDob);
        setAlert({
          type: 'success',
          message: `Found record for ${res.student.name}! Your Roll Number is ${res.student.roll_no}.`,
        });
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'No candidate found matching these credentials.',
        });
      }
    } catch (err) {
      console.error('Find student error:', err);
      setAlert({
        type: 'error',
        message: 'Failed to search for candidate record.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBack = () => {
    setAdmitCardData(null);
    setAlert(null);
  };

  if (admitCardData) {
    return <AdmitCardDisplay data={admitCardData} onBack={handleBack} />;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Card Header & Tabs */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-600/30 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                Admit Card Portal
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Central Examination 2026 Hall Ticket Verification
              </p>
            </div>
          </div>

          {/* Dual Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('verify');
                setAlert(null);
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'verify'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              I Have Roll Number
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('find');
                setAlert(null);
              }}
              className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'find'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Forgot Roll Number?
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {alert && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs sm:text-sm animate-fadeIn ${
                alert.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {alert.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              )}
              <div className="flex-1">{alert.message}</div>
            </div>
          )}

          {/* TAB 1: DIRECT VERIFICATION */}
          {activeTab === 'verify' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Roll Number *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. EXAM20260001"
                    required
                    className="form-input pl-10 font-mono uppercase tracking-wider text-slate-900"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: EXAM2026 followed by 4 digits.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Date of Birth (as registered) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="form-input pl-10"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3.5 text-sm font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Credentials...
                    </>
                  ) : (
                    <>
                      Verify & Access Admit Card
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FORGOT ROLL NUMBER */}
          {activeTab === 'find' && (
            <div className="space-y-5 animate-fadeIn">
              <form onSubmit={handleFindStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Registered Email or 10-Digit Mobile *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={findIdentifier}
                      onChange={(e) => setFindIdentifier(e.target.value)}
                      placeholder="Enter email or 10-digit mobile number"
                      required
                      className="form-input pl-10 text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Registered Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={findDob}
                      onChange={(e) => setFindDob(e.target.value)}
                      required
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full btn btn-primary py-3 text-xs font-semibold"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching Records...
                    </>
                  ) : (
                    <>
                      Find My Roll Number
                      <Search className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Found Result Card */}
              {foundStudent && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                        Found Candidate
                      </span>
                      <h4 className="font-heading font-bold text-slate-900 text-base">
                        {foundStudent.name}
                      </h4>
                    </div>
                    <span className="font-mono text-sm font-bold bg-white text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
                      {foundStudent.roll_no}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Allotted Center:{' '}
                    <strong className="text-slate-800">{foundStudent.allotted_center}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('verify');
                      setRollNumber(foundStudent.roll_no);
                      setDob(findDob);
                    }}
                    className="w-full btn btn-success py-2.5 text-xs font-semibold"
                  >
                    Proceed with this Roll Number
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Not yet registered for the examination?{' '}
              <a
                href="/apply"
                className="font-semibold text-primary-600 hover:text-primary-700 underline"
              >
                Register online here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
