/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

import { format, parse } from 'date-fns';

/**
 * Formats a time string from "HH:MM:SS" to "HH:MM AM/PM"
 */
export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'hh:mm a');
  } catch {
    return time;
  }
}

/**
 * Formats a date string to readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Formats a date for display on admit card
 */
export function formatExamDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'EEEE, dd MMMM yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Generates examination center information
 */
export function getExamCenterInfo() {
  return {
    name: process.env.NEXT_PUBLIC_CENTER_NAME || 'Main Examination Center',
    address: process.env.NEXT_PUBLIC_CENTER_ADDRESS || '123 Education Street, Knowledge City',
    examDate: process.env.NEXT_PUBLIC_EXAM_DATE || '2026-03-15',
  };
}

/**
 * Creates a slug-friendly string from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Delays execution for specified milliseconds
 * Useful for showing loading states
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parses JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Truncates text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Converts slot number to readable slot name
 */
export function getSlotName(slotNumber: number): string {
  const slotNames: Record<number, string> = {
    1: 'Morning Slot 1',
    2: 'Morning Slot 2',
    3: 'Afternoon Slot 1',
    4: 'Afternoon Slot 2',
  };
  return slotNames[slotNumber] || `Slot ${slotNumber}`;
}

/**
 * Validates if registration is still open
 * Based on total capacity and current date
 */
export function isRegistrationOpen(totalFilled: number, totalCapacity: number): boolean {
  // Check capacity
  if (totalFilled >= totalCapacity) {
    return false;
  }

  // Check if exam date has passed
  const examDate = new Date(process.env.NEXT_PUBLIC_EXAM_DATE || '2026-03-15');
  const today = new Date();
  
  if (today >= examDate) {
    return false;
  }

  return true;
}

/**
 * Generates a random color for slot badges
 */
export function getSlotColor(slotNumber: number): string {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
  ];
  return colors[(slotNumber - 1) % colors.length];
}

/**
 * Format mobile number for display
 */
export function formatMobile(mobile: string): string {
  if (mobile.length !== 10) return mobile;
  return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
