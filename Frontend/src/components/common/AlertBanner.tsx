import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertBannerProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant = 'error',
  title,
  message,
  onClose,
  className = '',
  action,
}) => {
  const styles = {
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
      actionBtn: 'text-rose-700 hover:text-rose-900 underline font-semibold',
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
      actionBtn: 'text-emerald-700 hover:text-emerald-900 underline font-semibold',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
      actionBtn: 'text-amber-700 hover:text-amber-900 underline font-semibold',
    },
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      icon: <Info className="w-4 h-4 text-indigo-600 shrink-0" />,
      actionBtn: 'text-indigo-700 hover:text-indigo-900 underline font-semibold',
    },
  };

  const current = styles[variant];

  return (
    <div
      className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${current.bg} ${className}`}
      role="alert"
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-xs tracking-tight mb-0.5">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`mt-2 text-xs cursor-pointer ${current.actionBtn}`}
          >
            {action.label}
          </button>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
