/**
 * Reusable Form Input Component
 * Includes label, error display, and accessibility features
 */

import { FormFieldProps } from '@/lib/types';

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      {/* Label */}
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input field */}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${error ? 'error border-red-500' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {/* Error message */}
      {error && (
        <p 
          id={`${name}-error`} 
          className="text-sm text-red-600 mt-1 flex items-center gap-1"
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
