/**
 * Reusable Alert Component
 * Displays success, error, warning, and info messages
 */

import { AlertProps } from '@/lib/types';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Alert({ type, message, onClose }: AlertProps) {
  // Icon and style mapping based on alert type
  const config = {
    success: {
      icon: CheckCircle,
      className: 'alert-success',
    },
    error: {
      icon: XCircle,
      className: 'alert-error',
    },
    warning: {
      icon: AlertTriangle,
      className: 'alert-warning',
    },
    info: {
      icon: Info,
      className: 'alert-info',
    },
  };

  const { icon: Icon, className } = config[type];

  return (
    <div className={`alert ${className} animate-fadeIn`} role="alert">
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
