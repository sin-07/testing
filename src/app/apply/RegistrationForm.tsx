'use client';

/**
 * Supercharged Multi-Step Student Registration Wizard
 * 
 * Features:
 * - 3-Step Guided Wizard with smooth transition animations
 * - Step 1: Candidate Verification & Personal Profile (with Age calculation)
 * - Step 2: Interactive Center Selector with Live Capacity & Distance indicator
 * - Step 3: Summary Review & Declaration
 * - Step 4: Celebration Screen with zero-dependency Canvas Confetti, 1-click Roll Number Copy, and Direct Admit Card Link
 * - Full support for pre-selected centers from URL query
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerStudent, getCenters } from '@/actions/registration';
import { EXAM_CENTERS, RegistrationResult } from '@/lib/types';
import { CENTER_METADATA_LIST, getDistanceBetweenCenters } from '@/lib/proximity';
import { triggerConfetti } from '@/lib/confetti';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Download,
  Info,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface CenterLiveInfo {
  id: string;
  name: string;
  code: string;
  location: string;
  city: string;
  capacity: number;
  filled_count: number;
  available: number;
  isFull: boolean;
}

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCenter = searchParams.get('center');

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [centers, setCenters] = useState<CenterLiveInfo[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const [copiedRoll, setCopiedRoll] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    selectedCenter: preSelectedCenter || '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch centers with live capacity
  useEffect(() => {
    async function loadCenters() {
      try {
        const res = await getCenters();
        if (res.success && res.centers) {
          setCenters(res.centers as CenterLiveInfo[]);
        }
      } catch (err) {
        console.error('Failed to load centers:', err);
      } finally {
        setLoadingCenters(false);
      }
    }
    loadCenters();
  }, []);

  // Update center if preselected from URL
  useEffect(() => {
    if (preSelectedCenter && EXAM_CENTERS.includes(preSelectedCenter as any)) {
      setFormData((prev) => ({ ...prev, selectedCenter: preSelectedCenter }));
    }
  }, [preSelectedCenter]);

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const currentAge = calculateAge(formData.dob);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Step 1 validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      errors.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    } else {
      const age = calculateAge(formData.dob);
      if (age !== null && (age < 14 || age > 80)) {
        errors.dob = 'Candidate must be at least 14 years old';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.selectedCenter) {
      errors.selectedCenter = 'Please select a preferred examination center';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setAlert(null);
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setAlert(null);
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setAlert(null);
    if (step > 1) {
      setStep((prev) => (prev - 1) as any);
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    setIsLoading(true);
    setAlert(null);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('mobile', formData.mobile.replace(/\D/g, ''));
      submitData.append('dob', formData.dob);
      submitData.append('selectedCenter', formData.selectedCenter);

      const result = await registerStudent(submitData);

      if (result.success) {
        setRegistrationResult(result);
        setStep(4);
        triggerConfetti();
      } else {
        setAlert({
          type: 'error',
          message: result.message || 'Registration failed. Please check your details and try again.',
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setAlert({
        type: 'error',
        message: 'A network or server error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyRoll = () => {
    if (registrationResult?.roll_number) {
      navigator.clipboard.writeText(registrationResult.roll_number);
      setCopiedRoll(true);
      setTimeout(() => setCopiedRoll(false), 2000);
    }
  };

  const selectedCenterData = centers.find((c) => c.name === formData.selectedCenter);

  // ==========================================
  // STEP 4: SUCCESS & CELEBRATION
  // ==========================================
  if (step === 4 && registrationResult) {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Registration Confirmed
            </span>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Seat Secured Successfully!
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-md mx-auto">
              Your examination seat has been officially locked and recorded in the database.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Roll Number Card with Copy */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                  Official Roll Number
                </span>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5 tracking-wider">
                  {registrationResult.roll_number}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Keep this safe. Required to access your admit card and examination hall.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyRoll}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm text-xs font-semibold transition-all active:scale-95 shrink-0"
              >
                {copiedRoll ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Roll No.
                  </>
                )}
              </button>
            </div>

            {/* Smart Re-allocation notification badge if routed */}
            {registrationResult.was_reallocated && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3">
                <Compass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-semibold">Smart Proximity Routing Applied: </strong>
                  {registrationResult.reallocation_reason ||
                    `Your preferred center (${registrationResult.preferred_center}) was at maximum capacity (8/8). Our engine automatically routed you to the nearest open center (${registrationResult.allotted_center_name}) to protect your registration.`}
                </div>
              </div>
            )}

            {/* Candidate & Allotment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
              <div>
                <span className="text-xs text-slate-500 font-medium">Candidate Name:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formData.name}</p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Allotted Exam Center:</span>
                <p className="font-semibold text-primary-700 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  {registrationResult.allotted_center_name}
                  {registrationResult.allotted_center_code && (
                    <span className="text-xs font-mono bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded">
                      {registrationResult.allotted_center_code}
                    </span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Examination Date:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {process.env.NEXT_PUBLIC_EXAM_DATE || '15th March 2026'}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-medium">Exam Shift & Timing:</span>
                <p className="font-semibold text-slate-800 mt-0.5">10:00 AM - 1:00 PM (IST)</p>
              </div>

              {registrationResult.allotted_center_location && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs text-slate-500 font-medium">Venue Address:</span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {registrationResult.allotted_center_location}
                  </p>
                </div>
              )}
            </div>

            {/* Email dispatch alert */}
            <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-100/70 p-3 rounded-xl border border-slate-200">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                A confirmation email with these credentials has been sent to{' '}
                <strong className="text-slate-800">{formData.email}</strong>.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/admit-card')}
                className="flex-1 btn btn-primary py-3.5 text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Download Admit Card Now
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setRegistrationResult(null);
                  setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    dob: '',
                    selectedCenter: '',
                  });
                }}
                className="btn btn-secondary py-3.5 text-sm"
              >
                Register Another Candidate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // WIZARD STEPS 1, 2, 3
  // ==========================================
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 overflow-hidden">
        {/* Wizard Progress Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                Step {step} of 3
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mt-0.5">
                {step === 1 && 'Candidate Profile'}
                {step === 2 && 'Exam Center Preference'}
                {step === 3 && 'Verification & Confirmation'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TLS 256-bit</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-primary-500' : 'bg-slate-700'
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  {s === 1 && '1. Details'}
                  {s === 2 && '2. Center'}
                  {s === 3 && '3. Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {alert && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-sm animate-fadeIn ${
                alert.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">{alert.message}</div>
            </div>
          )}

          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name (as per Photo ID) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Kumar Verma"
                    className={`form-input pl-10 ${formErrors.name ? 'error' : ''}`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul.verma@example.com"
                    className={`form-input pl-10 ${formErrors.email ? 'error' : ''}`}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Roll number and Admit card link will be sent to this email.
                </p>
                {formErrors.email && (
                  <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Mobile Number & DOB Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className={`form-input pl-12 font-mono ${formErrors.mobile ? 'error' : ''}`}
                    />
                  </div>
                  {formErrors.mobile && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.mobile}</p>
                  )}
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`form-input ${formErrors.dob ? 'error' : ''}`}
                    />
                  </div>
                  {currentAge !== null && currentAge > 0 && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      Age: {currentAge} years old
                    </p>
                  )}
                  {formErrors.dob && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.dob}</p>
                  )}
                </div>
              </div>

              {/* Bottom Continue button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full btn btn-primary py-3.5 text-sm font-semibold"
                >
                  Continue to Center Selection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CENTER SELECTION */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  Select Preferred Exam Center
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose your primary location. If seats fill before submission, the smart engine
                  routes to the closest neighbor automatically.
                </p>
              </div>

              {/* Centers selection grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {CENTER_METADATA_LIST.map((meta) => {
                  const live = centers.find((c) => c.name.toLowerCase() === meta.name.toLowerCase());
                  const capacity = live?.capacity || meta.capacity || 8;
                  const filled = live?.filled_count || 0;
                  const available = Math.max(0, capacity - filled);
                  const isFull = available === 0;
                  const isSelected = formData.selectedCenter === meta.name;

                  return (
                    <div
                      key={meta.name}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, selectedCenter: meta.name }))
                      }
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/60 ring-2 ring-primary-500/20 shadow-sm'
                          : isFull
                          ? 'border-slate-200 bg-slate-50/80 hover:border-slate-300'
                          : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span className="font-bold text-sm text-slate-900 font-heading">
                            {meta.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 font-medium">
                          {meta.code}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                        {meta.location}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                        <span
                          className={`font-semibold ${
                            isFull
                              ? 'text-rose-600'
                              : available <= 2
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {isFull ? 'Capacity Full (8/8)' : `${available} seats open`}
                        </span>
                        <span className="text-[10px] text-slate-400">Cap: {capacity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formErrors.selectedCenter && (
                <p className="text-xs text-rose-600">{formErrors.selectedCenter}</p>
              )}

              {/* Selected center smart helper */}
              {selectedCenterData?.isFull && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
                  <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Capacity Notice: </strong>
                    {formData.selectedCenter} is currently at capacity. Submitting will
                    automatically secure your seat in the nearest available neighboring center
                    (e.g., Danapur, Patna City, or Fatuha) without losing your exam registration.
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn btn-secondary py-3 px-5 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 btn btn-primary py-3 text-xs font-semibold"
                >
                  Review Details & Confirm
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  Verify Application Details
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please review your personal information and center preference before locking in your seat.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Candidate Full Name:</span>
                    <span className="font-bold text-slate-800">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Registered Email:</span>
                    <span className="font-bold text-slate-800">{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Mobile Number:</span>
                    <span className="font-mono font-bold text-slate-800">+91 {formData.mobile}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-bold text-slate-800">{formData.dob}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Selected Exam Center:</span>
                    <span className="font-bold text-primary-700">{formData.selectedCenter}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p>
                    By clicking <strong>Confirm & Submit</strong>, you certify that the information
                    provided is correct. Your roll number will be generated immediately and cannot be modified.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handlePrevStep}
                  className="btn btn-secondary py-3 px-5 text-xs font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="flex-1 btn btn-primary py-3.5 text-sm font-semibold"
                >
                  {isLoading ? 'Locking in Seat...' : 'Confirm & Submit Registration'}
                  {!isLoading && <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
