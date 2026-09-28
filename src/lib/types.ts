/**
 * TypeScript Types for the Examination Center Allotment System
 * Defines all data structures used throughout the application
 */

// ============================================================
// Database Types
// ============================================================

export interface Center {
  id: string;
  name: string;
  code?: string;
  location?: string;
  location_order?: number;
  city?: string;
  capacity: number;
  filled_count: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string; // DATE format: "YYYY-MM-DD"
  roll_no: string | null;
  selected_center: string;
  allotted_center_id: string | null;
  registration_status: 'pending' | 'confirmed' | 'cancelled';
  email_sent: boolean;
  was_reallocated?: boolean;
  preferred_center?: string;
  reallocation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentWithCenter extends Student {
  allotted_center?: string | null;
  center_code?: string;
  center_location?: string;
}

export interface EmailLog {
  id: string;
  student_id: string;
  email_type: string;
  recipient_email: string;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  sent_at: string;
}

// ============================================================
// Constants
// ============================================================

export const EXAM_CENTERS = [
  'Patna',
  'Gaya',
  'Patna City',
  'Danapur',
  'Buxar',
  'Rajgir',
  'Biharsharif',
  'Nalanda',
  'Pawapuri',
  'Fatuha',
] as const;

export type ExamCenter = typeof EXAM_CENTERS[number];

// ============================================================
// Form & API Types
// ============================================================

export interface NtaCandidateProfile {
  name: string;
  fatherName?: string;
  motherName?: string;
  dob: string;
  gender?: string;
  category?: string;
  pwdStatus?: string;
  identityType?: string;
  identityNumber?: string;
  stateOfEligibility?: string;
  nationality?: string;
  email: string;
  mobile: string;
  paper?: string;
  medium?: string;
  choice1: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  class10Board?: string;
  class10Year?: string;
  class10Roll?: string;
  class10Marks?: string;
  class12Status?: string;
  class12Board?: string;
  class12Stream?: string;
  photoUrl?: string;
  signatureUrl?: string;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  selectedCenter: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  category?: string;
  pwdStatus?: string;
  identityType?: string;
  identityNumber?: string;
  stateOfEligibility?: string;
  nationality?: string;
  paper?: string;
  medium?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  class10Board?: string;
  class10Year?: string;
  class10Roll?: string;
  class10Marks?: string;
  class12Status?: string;
  class12Board?: string;
  class12Stream?: string;
  photoUrl?: string;
  signatureUrl?: string;
}

export interface RegistrationResult {
  success: boolean;
  message: string;
  student_id?: string;
  roll_number?: string;
  application_no?: string;
  allotted_center_id?: string;
  allotted_center_name?: string;
  allotted_center_code?: string;
  allotted_center_location?: string;
  was_reallocated?: boolean;
  preferred_center?: string;
  distance_km?: number;
  reallocation_reason?: string;
  exam_shift?: string;
  reporting_time?: string;
  gate_closing_time?: string;
  candidate?: NtaCandidateProfile;
}

export interface AdmitCardData {
  student: {
    name: string;
    roll_no: string;
    dob: string;
    email: string;
    mobile: string;
  };
  center: {
    name: string;
    code?: string;
    location?: string;
    city?: string;
  };
  exam: {
    date: string;
    time: string;
    reportingTime?: string;
    gateClosingTime?: string;
  };
  reallocated?: boolean;
  preferred_center?: string;
  verificationHash?: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface CenterStats {
  totalCenters: number;
  totalCapacity: number;
  totalFilled: number;
  availableSeats: number;
  centers: Center[];
}

// ============================================================
// Component Props Types
// ============================================================

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}
