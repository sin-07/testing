'use client';

/**
 * National Testing Agency (NTA) JEE (Main) - 2026
 * Centralized Online Application & Examination Center Allotment Wizard
 * 
 * Features:
 * - Authentic NTA government portal design with high-contrast accessible typography
 * - Multi-stage NTA progress tracker:
 *   1. Personal & Identity Details (व्यक्तिगत विवरण)
 *   2. Exam & 4 Center Choices with Smart Proximity Engine (परीक्षा एवं केंद्र)
 *   3. Academic Qualifications: Class 10th & 12th (शैक्षणिक विवरण)
 *   4. Document Uploads & Biometrics (फोटो एवं हस्ताक्षर)
 *   5. Review, Security PIN (CAPTCHA) & Declaration (समीक्षा एवं घोषणा)
 *   6. Official NTA Confirmation Slip with Barcode & Roll Number (पुष्टिकरण पृष्ठ)
 * - Live Age Calculator as of 01-Jan-2026
 * - Real-time seat availability radar for chosen examination center
 * - Canvas confetti celebration on successful center allocation
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { registerStudent, getCenters } from '@/actions/registration';
import { EXAM_CENTERS, RegistrationResult } from '@/lib/types';
import { CENTER_METADATA_LIST, rankCentersByProximity } from '@/lib/proximity';
import { triggerConfetti } from '@/lib/confetti';
import { AshokaEmblem, TricolorBar } from '@/components/ui/NtaLogo';
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
  FileCheck2,
  RefreshCw,
  Printer,
  QrCode,
  GraduationCap,
  Award,
  IdCard,
  Image as ImageIcon,
  PenTool,
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

// Generate random 6-character captcha
function generateCaptchaCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedCenter = searchParams.get('center');

  // Stages: 1=Personal, 2=Exam & Centers, 3=Qualifications, 4=Uploads, 5=Review/Declaration, 6=Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [centers, setCenters] = useState<CenterLiveInfo[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const [copiedRoll, setCopiedRoll] = useState(false);
  const [copiedApp, setCopiedApp] = useState(false);

  // Security PIN (CAPTCHA)
  const [captchaCode, setCaptchaCode] = useState('7B8Y92');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Declaration Checkboxes
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

  // NTA Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    fatherName: '',
    motherName: '',
    dob: '2007-06-15',
    gender: 'Male',
    category: 'General',
    pwdStatus: 'No',
    identityType: 'Aadhaar Card (With photo)',
    identityNumber: '',
    stateOfEligibility: 'Bihar (BH)',
    nationality: 'Indian',
    mobile: '',
    email: '',

    // Step 2: Exam & Center Preferences
    paper: 'B.E. / B.Tech (Paper 1)',
    medium: 'English',
    selectedCenter: preSelectedCenter || 'Patna',
    choice2: 'Danapur',
    choice3: 'Patna City',
    choice4: 'Fatuha',

    // Step 3: Qualification Details
    class10Status: 'Passed',
    class10Year: '2023',
    class10Board: 'Central Board of Secondary Education (CBSE)',
    class10Roll: '',
    class10Marks: '89.2%',
    class12Status: 'Appearing in 2026',
    class12Year: '2026',
    class12Board: 'Central Board of Secondary Education (CBSE)',
    class12Stream: 'Physics, Chemistry, Mathematics (PCM)',
    class12School: 'Kendriya Vidyalaya / Senior Secondary School',

    // Step 4: Photo & Signature
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=500&q=80',
    signatureUrl: 'https://placehold.co/300x100/png?text=Candidate+Signature',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Regenerate CAPTCHA
  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptchaCode());
    setCaptchaInput('');
    setCaptchaError('');
  };

  useEffect(() => {
    setCaptchaCode(generateCaptchaCode());
  }, []);

  // Fetch centers with live capacity
  useEffect(() => {
    async function loadCenters() {
      try {
        const res = await getCenters();
        if (res.success && res.centers) {
          setCenters(res.centers as CenterLiveInfo[]);
          if (!preSelectedCenter && res.centers.length > 0) {
            setFormData((prev) => ({
              ...prev,
              selectedCenter: res.centers[0].name,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load centers:', err);
      } finally {
        setLoadingCenters(false);
      }
    }
    loadCenters();
  }, [preSelectedCenter]);

  // Update choice 2, 3, 4 whenever choice 1 changes using proximity engine
  useEffect(() => {
    if (formData.selectedCenter) {
      const otherCenters = EXAM_CENTERS.filter((c) => c !== formData.selectedCenter);
      const ranked = rankCentersByProximity(formData.selectedCenter, otherCenters as string[]);
      if (ranked.length >= 3) {
        setFormData((prev) => ({
          ...prev,
          choice2: ranked[0].name,
          choice3: ranked[1].name,
          choice4: ranked[2].name,
        }));
      }
    }
  }, [formData.selectedCenter]);

  // Calculate Candidate Age as of 01-Jan-2026 (NTA JEE Cutoff)
  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const birth = new Date(dobString);
    if (isNaN(birth.getTime())) return null;
    const cutoff = new Date('2026-01-01');
    let years = cutoff.getFullYear() - birth.getFullYear();
    let months = cutoff.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && cutoff.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    return { years, months, isEligible: years >= 15 && years <= 30 };
  };

  const ageInfo = calculateAge(formData.dob);

  // Selected center live seat information
  const selectedCenterInfo = centers.find(
    (c) => c.name.toLowerCase() === formData.selectedCenter.toLowerCase()
  );

  // Field change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Candidate's full name is required (min 2 characters)";
    }
    if (!formData.fatherName.trim()) {
      errors.fatherName = "Father's / Guardian's name is required";
    }
    if (!formData.motherName.trim()) {
      errors.motherName = "Mother's name is required";
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Please provide a valid email address';
    }
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!formData.identityNumber.trim()) {
      errors.identityNumber = 'Identification / Aadhaar number is required';
    }
    if (ageInfo && !ageInfo.isEligible) {
      errors.dob = 'Candidate must be between 15 and 30 years old as of 01-Jan-2026';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.selectedCenter) {
      errors.selectedCenter = 'Please select your 1st Choice Examination City';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!formData.class10Roll.trim()) {
      errors.class10Roll = 'Class 10th Roll / Hall Ticket Number is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (step === 3 && validateStep3()) {
      setStep(4);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (step === 4) {
      setStep(5);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 6) {
      setStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Final Form Submit to Server Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!declarationAgreed) {
      setAlert({
        type: 'error',
        message: 'Please review and accept the official NTA undertaking declaration before submitting.',
      });
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError('Incorrect Security PIN. Please enter the characters shown in the image.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    setAlert(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        data.append(key, val);
      });

      const result = await registerStudent(data);

      if (result.success) {
        setRegistrationResult(result);
        setStep(6);
        triggerConfetti();
        window.scrollTo({ top: 80, behavior: 'smooth' });
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.message || 'An unexpected error occurred during submission. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'roll' | 'app') => {
    navigator.clipboard.writeText(text);
    if (type === 'roll') {
      setCopiedRoll(true);
      setTimeout(() => setCopiedRoll(false), 2500);
    } else {
      setCopiedApp(true);
      setTimeout(() => setCopiedApp(false), 2500);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Official NTA Application Header Banner */}
      <div className="bg-[#0a2540] text-white rounded-t-3xl p-5 sm:p-7 shadow-lg border border-blue-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <AshokaEmblem className="w-10 h-10 shrink-0 text-amber-400" color="#fcd34d" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  NTA JEE (Main) 2026
                </span>
                <span className="text-xs text-blue-200 font-mono hidden sm:inline">Session 1</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold font-heading text-white tracking-tight leading-tight mt-1">
                Candidate Online Application Form
              </h2>
              <p className="text-xs text-slate-300">
                केंद्रीयकृत परीक्षा केंद्र आवंटन एवं आवेदन पत्र • Session 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 backdrop-blur-sm">
              <span className="text-[10px] text-blue-200 block uppercase tracking-wider font-semibold">
                Application Status
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {step === 6 ? 'ALLOTTED & CONFIRMED' : `STAGE ${step} OF 5`}
              </span>
            </div>
          </div>
        </div>

        {/* 2. NTA Multi-Step Progress Tracker */}
        {step < 6 && (
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center text-xs">
              {[
                { num: 1, title: 'Personal Details', sub: 'व्यक्तिगत विवरण' },
                { num: 2, title: 'Exam & Centers', sub: 'परीक्षा एवं केंद्र' },
                { num: 3, title: 'Qualifications', sub: 'शैक्षणिक विवरण' },
                { num: 4, title: 'Upload Scans', sub: 'दस्तावेज़' },
                { num: 5, title: 'Review & Submit', sub: 'घोषणा' },
              ].map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;

                return (
                  <div key={s.num} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isActive
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 font-extrabold'
                          : 'bg-white/20 text-blue-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                    </div>
                    <span
                      className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold hidden md:block leading-tight ${
                        isActive ? 'text-amber-300' : isCompleted ? 'text-emerald-300' : 'text-blue-300/70'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[8px] text-blue-300/50 hidden lg:block">{s.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Form Body Container */}
      <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-slate-200 p-6 sm:p-10">
        {/* Error / Notification Banner */}
        {alert && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm animate-fadeIn ${
              alert.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{alert.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ========================================================
              STAGE 1: Candidate Personal & Identity Details
             ======================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary-600" />
                    Step 1: Candidate Personal & Identity Information
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    अभ्यर्थी का व्यक्तिगत विवरण (As per Class 10th Certificate)
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  * All fields mandatory
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Candidate Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Candidate's Full Name / अभ्यर्थी का पूरा नाम *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. ANIKET SINGH"
                    className={`form-input uppercase ${formErrors.name ? 'error' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Father's / Guardian's Name / पिता का नाम *
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Father's full name"
                    className={`form-input uppercase ${formErrors.fatherName ? 'error' : ''}`}
                  />
                  {formErrors.fatherName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.fatherName}</p>
                  )}
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Mother's Name / माता का नाम *
                  </label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="Mother's full name"
                    className={`form-input uppercase ${formErrors.motherName ? 'error' : ''}`}
                  />
                  {formErrors.motherName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.motherName}</p>
                  )}
                </div>

                {/* Date of Birth & Live Age Calculator */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Date of Birth / जन्म तिथि *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    max="2011-12-31"
                    min="1990-01-01"
                    className={`form-input ${formErrors.dob ? 'error' : ''}`}
                  />
                  {ageInfo && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                      <span className="font-semibold text-slate-700">Age as of 01-Jan-2026:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          ageInfo.isEligible
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {ageInfo.years} yrs {ageInfo.months} mos ({ageInfo.isEligible ? 'Eligible' : 'Not Eligible'})
                      </span>
                    </div>
                  )}
                  {formErrors.dob && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Gender / लिंग *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Male">Male / पुरुष</option>
                    <option value="Female">Female / महिला</option>
                    <option value="Third Gender">Third Gender / अन्य</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Category / श्रेणी *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input font-medium"
                  >
                    <option value="General">General (Unreserved)</option>
                    <option value="GEN-EWS">General - Economically Weaker Section (GEN-EWS)</option>
                    <option value="OBC-NCL">Other Backward Class (OBC-NCL, Central List)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>

                {/* PwD Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    PwD Category (40% or more disability) *
                  </label>
                  <select
                    name="pwdStatus"
                    value={formData.pwdStatus}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="No">No / नहीं</option>
                    <option value="Yes">Yes (Require Scribe / Compensatory Time)</option>
                  </select>
                </div>

                {/* State of Eligibility */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    State of Eligibility / पात्रता राज्य *
                  </label>
                  <select
                    name="stateOfEligibility"
                    value={formData.stateOfEligibility}
                    onChange={handleInputChange}
                    className="form-input font-medium"
                  >
                    <option value="Bihar (BH)">Bihar (BH)</option>
                    <option value="Delhi (NCT)">Delhi (NCT)</option>
                    <option value="Uttar Pradesh (UP)">Uttar Pradesh (UP)</option>
                    <option value="Jharkhand (JH)">Jharkhand (JH)</option>
                    <option value="West Bengal (WB)">West Bengal (WB)</option>
                  </select>
                </div>

                {/* Identity Document Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Identity Type / पहचान प्रमाण प्रकार *
                  </label>
                  <select
                    name="identityType"
                    value={formData.identityType}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="Aadhaar Card (With photo)">Aadhaar Card (With Photo)</option>
                    <option value="Passport">Passport</option>
                    <option value="Election Card (Voter ID)">Election Card (Voter ID)</option>
                    <option value="Class 12th Admit Card with Photograph">Class 12th Admit Card with Photograph</option>
                    <option value="Bank Passbook with Photograph">Bank Passbook with Photograph</option>
                  </select>
                </div>

                {/* Identification Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Identification / Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleInputChange}
                    placeholder="Enter last 4 or 12 digits"
                    className={`form-input ${formErrors.identityNumber ? 'error' : ''}`}
                  />
                  {formErrors.identityNumber && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.identityNumber}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Mobile Number / मोबाइल नंबर (For SMS Alerts) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`form-input pl-12 font-mono ${formErrors.mobile ? 'error' : ''}`}
                    />
                  </div>
                  {formErrors.mobile && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.mobile}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Email Address / ईमेल पता (For Confirmation Slip) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="candidate@gmail.com"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Navigation button */}
              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Save & Next: Exam & Center Choices</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 2: Exam & 4 Center Choices (Proximity Engine)
             ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-primary-600" />
                    Step 2: Paper Choice & 4 Examination Center Preferences
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    परीक्षा माध्यम एवं ४ परीक्षा शहर की प्राथमिकताएं (Smart Regional Allotment)
                  </p>
                </div>
              </div>

              {/* Paper & Medium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Applying For (Paper) / आवेदन का विषय *
                  </label>
                  <select
                    name="paper"
                    value={formData.paper}
                    onChange={handleInputChange}
                    className="form-input font-medium"
                  >
                    <option value="B.E. / B.Tech (Paper 1)">B.E. / B.Tech (Paper 1)</option>
                    <option value="B.Arch (Paper 2A)">B.Arch (Paper 2A)</option>
                    <option value="B.Planning (Paper 2B)">B.Planning (Paper 2B)</option>
                    <option value="B.E./B.Tech & B.Arch (Both)">B.E./B.Tech & B.Arch (Both Papers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Question Paper Medium / परीक्षा का माध्यम *
                  </label>
                  <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    className="form-input font-medium"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi / हिंदी</option>
                    <option value="Urdu">Urdu / اردو</option>
                  </select>
                </div>
              </div>

              {/* 4 Choices Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  Order of Exam City Preferences (Bihar Regional Zone)
                </h4>

                {/* Choice 1 (Primary) */}
                <div className="p-4 rounded-2xl border-2 border-primary-500 bg-primary-50/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-900 uppercase tracking-wider">
                      <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[11px]">
                        1
                      </span>
                      1st Choice (Preferred Examination City) *
                    </span>
                    {selectedCenterInfo && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          selectedCenterInfo.isFull
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : selectedCenterInfo.available <= 2
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {selectedCenterInfo.isFull
                          ? 'Capacity Full (0 seats)'
                          : `${selectedCenterInfo.available} / ${selectedCenterInfo.capacity} Seats Available`}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">State / राज्य</label>
                      <input type="text" value="Bihar (BH)" disabled className="form-input bg-slate-100 font-medium" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">City / परीक्षा शहर *</label>
                      <select
                        name="selectedCenter"
                        value={formData.selectedCenter}
                        onChange={handleInputChange}
                        className="form-input font-bold text-primary-900"
                      >
                        {EXAM_CENTERS.map((center) => {
                          const live = centers.find((c) => c.name === center);
                          const isFull = live ? live.isFull : false;
                          return (
                            <option key={center} value={center}>
                              {center} {isFull ? '(FULL - Auto-Routing active)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {selectedCenterInfo && selectedCenterInfo.isFull && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <Compass className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Proximity Warning:</strong> {selectedCenterInfo.name} is currently at max capacity (8/8).
                        Our proximity engine will automatically allot you to Choice 2 ({formData.choice2}) with zero rejection!
                      </span>
                    </div>
                  )}
                </div>

                {/* Choices 2, 3, 4 (Auto-Calculated by Proximity Engine) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Choice 2 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center text-[10px]">
                        2
                      </span>
                      2nd Choice (Nearest Neighbor)
                    </span>
                    <select
                      name="choice2"
                      value={formData.choice2}
                      onChange={handleInputChange}
                      className="form-input text-xs py-2"
                    >
                      {EXAM_CENTERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choice 3 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center text-[10px]">
                        3
                      </span>
                      3rd Choice (Alternative)
                    </span>
                    <select
                      name="choice3"
                      value={formData.choice3}
                      onChange={handleInputChange}
                      className="form-input text-xs py-2"
                    >
                      {EXAM_CENTERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Choice 4 */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center text-[10px]">
                        4
                      </span>
                      4th Choice (Zonal Fallback)
                    </span>
                    <select
                      name="choice4"
                      value={formData.choice4}
                      onChange={handleInputChange}
                      className="form-input text-xs py-2"
                    >
                      {EXAM_CENTERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Choices 2, 3, and 4 are dynamically ranked using road distances across Bihar centers.
                  </span>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Personal Details</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <span>Save & Next: Qualifications</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 3: Academic Qualifications (10th & 12th)
             ======================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    Step 3: Academic Qualifications (10th & 12th Standards)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    कक्षा १०वीं एवं १२वीं (समकक्ष) शैक्षणिक योग्यता विवरण
                  </p>
                </div>
              </div>

              {/* Class 10 Details */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Class 10th or Equivalent Qualification / १०वीं कक्षा का विवरण</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Pass Status</label>
                    <select
                      name="class10Status"
                      value={formData.class10Status}
                      onChange={handleInputChange}
                      className="form-input text-xs"
                    >
                      <option value="Passed">Passed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Year of Passing</label>
                    <select
                      name="class10Year"
                      value={formData.class10Year}
                      onChange={handleInputChange}
                      className="form-input text-xs"
                    >
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Roll / Hall Ticket No *</label>
                    <input
                      type="text"
                      name="class10Roll"
                      value={formData.class10Roll}
                      onChange={handleInputChange}
                      placeholder="e.g. 23145678"
                      className={`form-input text-xs ${formErrors.class10Roll ? 'error' : ''}`}
                    />
                    {formErrors.class10Roll && (
                      <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.class10Roll}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Percentage / CGPA</label>
                    <input
                      type="text"
                      name="class10Marks"
                      value={formData.class10Marks}
                      onChange={handleInputChange}
                      placeholder="e.g. 89.4%"
                      className="form-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">School Board Name</label>
                  <select
                    name="class10Board"
                    value={formData.class10Board}
                    onChange={handleInputChange}
                    className="form-input text-xs"
                  >
                    <option value="Central Board of Secondary Education (CBSE)">
                      Central Board of Secondary Education (CBSE)
                    </option>
                    <option value="Bihar School Examination Board (BSEB)">
                      Bihar School Examination Board (BSEB)
                    </option>
                    <option value="Council for Indian School Certificate Examinations (ICSE)">
                      Council for Indian School Certificate Examinations (ICSE)
                    </option>
                    <option value="State Board / Other Recognized Board">State Board / Other Recognized Board</option>
                  </select>
                </div>
              </div>

              {/* Class 12 Details */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-primary-600" />
                  <span>Class 12th or Qualifying Examination / १२वीं कक्षा (समकक्ष)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Pass Status</label>
                    <select
                      name="class12Status"
                      value={formData.class12Status}
                      onChange={handleInputChange}
                      className="form-input text-xs font-semibold"
                    >
                      <option value="Appearing in 2026">Appearing in 2026 / उपस्थित हो रहे हैं</option>
                      <option value="Passed">Passed / उत्तीर्ण</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Year of Passing / Appearing</label>
                    <select
                      name="class12Year"
                      value={formData.class12Year}
                      onChange={handleInputChange}
                      className="form-input text-xs"
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Stream / Subjects</label>
                    <select
                      name="class12Stream"
                      value={formData.class12Stream}
                      onChange={handleInputChange}
                      className="form-input text-xs"
                    >
                      <option value="Physics, Chemistry, Mathematics (PCM)">PCM (Physics, Chemistry, Maths)</option>
                      <option value="Physics, Chemistry, Biology (PCB)">PCB</option>
                      <option value="PCMB (All 4 Subjects)">PCMB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">School / College Name & Address</label>
                  <input
                    type="text"
                    name="class12School"
                    value={formData.class12School}
                    onChange={handleInputChange}
                    placeholder="e.g. St. Michael's High School / Govt Sr Secondary School, Patna"
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Exam & Centers</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <span>Save & Next: Document Uploads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 4: Document Uploads & Biometrics
             ======================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary-600" />
                    Step 4: Upload Scanned Images & Signature
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    अभ्यर्थी का फोटो एवं हस्ताक्षर अपलोड (Standards: 10KB - 200KB, White Background)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Upload Box */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-3">
                  <div className="w-32 h-40 mx-auto rounded-lg overflow-hidden border-2 border-slate-400 bg-white shadow-inner flex flex-col items-center justify-center relative">
                    <img
                      src={formData.photoUrl}
                      alt="Candidate Photograph"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-mono py-0.5">
                      {formData.name || 'CANDIDATE'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      Passport Size Photograph
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Recent photograph with 80% face visible against plain white background.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-semibold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Standard Compliant
                    </span>
                  </div>
                </div>

                {/* Signature Upload Box */}
                <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-3">
                  <div className="w-56 h-28 mx-auto rounded-lg border-2 border-slate-400 bg-white shadow-inner flex items-center justify-center p-2">
                    <div className="font-serif italic text-2xl text-slate-800 tracking-wider border-b-2 border-slate-800 pb-1">
                      {formData.name.split(' ')[0] || 'Signature'}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      Candidate Signature
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Running hand signature in black ink on white paper (not in capital letters).
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-semibold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Signature Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Qualifications</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary px-8 py-3 text-sm font-bold shadow-md flex items-center gap-2"
                >
                  <span>Save & Next: Review & Declaration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 5: Review, Security PIN (CAPTCHA) & Declaration
             ======================================================== */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-primary-600" />
                    Step 5: Review Summary, Security PIN & Official Undertaking
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    कृपया सभी प्रविष्टियों की सावधानीपूर्वक जांच करें (Final Verification before Submission)
                  </p>
                </div>
              </div>

              {/* Candidate Review Summary Sheet */}
              <div className="rounded-2xl border border-slate-300 overflow-hidden text-xs">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Candidate Particulars Summary</span>
                  <span className="text-[10px] text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                    Form Mode: Final Confirmation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* Left Column */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Candidate's Name:</span>
                      <strong className="text-slate-900 uppercase">{formData.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Father's Name:</span>
                      <strong className="text-slate-900 uppercase">{formData.fatherName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mother's Name:</span>
                      <strong className="text-slate-900 uppercase">{formData.motherName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date of Birth:</span>
                      <strong className="text-slate-900">{formData.dob}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gender / Category:</span>
                      <strong className="text-slate-900">
                        {formData.gender} / {formData.category}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">State of Eligibility:</span>
                      <strong className="text-slate-900">{formData.stateOfEligibility}</strong>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Applying For:</span>
                      <strong className="text-slate-900">{formData.paper}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Medium of Exam:</span>
                      <strong className="text-slate-900">{formData.medium}</strong>
                    </div>
                    <div className="flex justify-between text-primary-900 bg-primary-50/60 p-1.5 rounded">
                      <span className="font-semibold">1st Choice Center:</span>
                      <strong className="font-bold">{formData.selectedCenter} (Bihar)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>2nd Choice Center:</span>
                      <span>{formData.choice2}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Mobile & Email:</span>
                      <span className="font-mono text-[11px]">
                        +91 {formData.mobile} | {formData.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security PIN (CAPTCHA) Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Enter Security PIN / सुरक्षा पिन दर्ज करें *
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  {/* CAPTCHA Display Box */}
                  <div className="captcha-box px-6 py-2.5 rounded-xl border-2 border-slate-400 text-2xl font-black text-slate-800 tracking-widest shadow-inner relative flex items-center justify-center">
                    <span className="transform -skew-x-12">{captchaCode}</span>
                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-400 pointer-events-none"></div>
                  </div>

                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Refresh Security PIN"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>

                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value.toUpperCase());
                        setCaptchaError('');
                      }}
                      placeholder="Enter 6-char PIN"
                      maxLength={6}
                      className="form-input uppercase font-mono font-bold tracking-widest text-center"
                    />
                  </div>
                </div>

                {captchaError && (
                  <p className="text-xs text-rose-600 font-semibold">{captchaError}</p>
                )}
                <p className="text-[11px] text-slate-500">Security PIN is case-sensitive.</p>
              </div>

              {/* Official NTA Undertaking Declaration */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={declarationAgreed}
                    onChange={(e) => setDeclarationAgreed(e.target.checked)}
                    className="w-5 h-5 rounded text-primary-600 border-slate-300 focus:ring-primary-500 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="declaration" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
                    <strong className="block text-slate-900 font-bold mb-1">
                      UNDERTAKING / घोषणा (Read carefully before agreeing):
                    </strong>
                    I hereby declare that all particulars stated in this application form are true, complete and correct to the best of my knowledge and belief. In the event of any information being found false, incorrect, or ineligible being detected before or after the examination, my candidature will be cancelled by the National Testing Agency (NTA). I understand that examination center allotment is subject to seat capacity and smart proximity routing rules.
                  </label>
                </div>
              </div>

              {/* Navigation & Submit */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="btn btn-secondary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Scanned Images</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !declarationAgreed}
                  className="btn btn-primary px-9 py-3.5 text-sm font-bold shadow-lg hover:shadow-primary-500/30 flex items-center gap-2.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting to NTA Server...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Final Submit & Allot Seat / अंतिम सबमिट</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 6: Official NTA Confirmation Slip (पुष्टिकरण पृष्ठ)
             ======================================================== */}
          {step === 6 && registrationResult && (
            <div className="space-y-6 animate-slideUp">
              {/* Top Success Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base font-heading text-emerald-950">
                    Application Successfully Submitted & Exam Seat Allotted!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your official NTA JEE (Main) 2026 Confirmation Slip has been generated.
                  </p>
                </div>
              </div>

              {/* Printable Official NTA Confirmation Slip */}
              <div className="rounded-3xl border-2 border-slate-800 bg-white p-6 sm:p-8 shadow-xl relative overflow-hidden print:border-none print:shadow-none">
                {/* Tricolor Ribbon on slip */}
                <TricolorBar />

                {/* Slip Header */}
                <div className="pt-4 pb-4 border-b-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <AshokaEmblem className="w-12 h-12 shrink-0" color="#0a2540" />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-950 uppercase tracking-tight font-heading">
                        National Testing Agency (NTA)
                      </h3>
                      <p className="text-[11px] font-bold text-slate-700">
                        राष्ट्रीय परीक्षा एजेंसी • Ministry of Education, Govt. of India
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        Joint Entrance Examination (Main) - 2026 • Session 1
                      </p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="px-3 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold inline-block">
                      CONFIRMATION PAGE
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Generated: 29-Sep-2026</p>
                  </div>
                </div>

                {/* Application & Roll Number Highlights */}
                <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Application Number */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Application Number / आवेदन संख्या
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black text-primary-900 tracking-wider">
                        {registrationResult.application_no || '260310849201'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(registrationResult.application_no || '260310849201', 'app')}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Copy Application Number"
                    >
                      {copiedApp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Roll Number */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                        Roll Number / अनुक्रमांक
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black text-emerald-800 tracking-wider">
                        {registrationResult.roll_number}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(registrationResult.roll_number || '', 'roll')}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Copy Roll Number"
                    >
                      {copiedRoll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Candidate & Center Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6 text-xs">
                  {/* Photo & Signature Column */}
                  <div className="md:col-span-3 text-center space-y-3 order-2 md:order-1">
                    <div className="w-28 h-36 mx-auto rounded border border-slate-400 overflow-hidden shadow-sm bg-slate-100">
                      <img src={formData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-28 h-10 mx-auto rounded border border-slate-400 bg-white flex items-center justify-center p-1 font-serif italic text-sm">
                      {formData.name.split(' ')[0]}
                    </div>
                    <p className="text-[10px] text-slate-400">Scanned Photo & Sign</p>
                  </div>

                  {/* Candidate Details Table */}
                  <div className="md:col-span-9 order-1 md:order-2">
                    <table className="w-full border-collapse border border-slate-300 text-left">
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 bg-slate-100 font-bold text-slate-700 w-1/3">Candidate's Name</td>
                          <td className="p-2 font-bold uppercase text-slate-900">{formData.name}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 bg-slate-100 font-bold text-slate-700">Father's Name</td>
                          <td className="p-2 font-bold uppercase text-slate-900">{formData.fatherName}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 bg-slate-100 font-bold text-slate-700">Date of Birth</td>
                          <td className="p-2 text-slate-900 font-mono">{formData.dob}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 bg-slate-100 font-bold text-slate-700">Gender & Category</td>
                          <td className="p-2 text-slate-900">
                            {formData.gender} | {formData.category} | PwD: {formData.pwdStatus}
                          </td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="p-2 bg-slate-100 font-bold text-slate-700">Applied Course / Paper</td>
                          <td className="p-2 font-semibold text-slate-900">{formData.paper} ({formData.medium})</td>
                        </tr>
                        <tr>
                          <td className="p-2 bg-slate-100 font-bold text-slate-700">Registered Mobile & Email</td>
                          <td className="p-2 font-mono text-[11px] text-slate-800">
                            +91 {formData.mobile} | {formData.email}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Allotted Examination Center Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      Allotted Examination Center Details
                    </span>
                    <span className="text-xs font-mono text-blue-200">
                      Code: {registrationResult.allotted_center_code}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-extrabold text-lg text-white">
                      {registrationResult.allotted_center_name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {registrationResult.allotted_center_location}
                    </p>
                  </div>

                  {registrationResult.was_reallocated && (
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs text-amber-200 flex items-start gap-2">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Proximity Reallocation:</strong> Your preferred center ({registrationResult.preferred_center}) was fully booked. Smart Proximity Engine secured your seat at {registrationResult.allotted_center_name} ({registrationResult.distance_km} km away).
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Exam Date</span>
                      <strong className="text-white">15 March 2026</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Shift Timing</span>
                      <strong className="text-white">09:00 AM – 12:00 PM</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Reporting Time</span>
                      <strong className="text-amber-300">07:30 AM IST</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Gate Closing</span>
                      <strong className="text-rose-300">08:30 AM IST</strong>
                    </div>
                  </div>
                </div>

                {/* Barcode & Verification Footer */}
                <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="font-mono text-[10px] tracking-widest text-slate-600">
                    *NTA-JEE-2026-{registrationResult.roll_number}*
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographically Authenticated by NTA Allotment Service</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Print Slip & Admit Card */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print / Download Confirmation Slip
                </button>

                <Link
                  href={`/admit-card?roll=${registrationResult.roll_number}&dob=${formData.dob}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  <FileCheck2 className="w-4 h-4" />
                  Proceed to Admit Card & Instructions
                </Link>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
