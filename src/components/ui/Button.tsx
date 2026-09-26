/**
 * Reusable Button Component with smooth transitions and state animations
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '@/lib/types';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
}: ButtonProps) {
  const variantStyles: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:from-primary-700 hover:to-indigo-700 active:scale-[0.98] shadow-md hover:shadow-primary-500/25',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 active:scale-[0.98] border border-gray-200',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-md hover:shadow-red-500/25',
    outline:
      'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:scale-[0.98]',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-md hover:shadow-emerald-500/25',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${
        variantStyles[variant] || variantStyles.primary
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
