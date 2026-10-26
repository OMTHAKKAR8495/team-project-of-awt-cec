import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  durationMs?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  durationMs = 5000,
  onClose,
  action,
  className = '',
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!durationMs || durationMs <= 0 || !onClose) return;

    const intervalTime = 50;
    const step = (intervalTime / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= step) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onClose]);

  const typeConfig = {
    success: {
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      progressBar: 'bg-emerald-500',
    },
    error: {
      border: 'border-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      progressBar: 'bg-rose-500',
    },
    warning: {
      border: 'border-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      progressBar: 'bg-amber-500',
    },
    info: {
      border: 'border-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
      progressBar: 'bg-indigo-500',
    },
  };

  const current = typeConfig[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden rounded-xl bg-white border shadow-lg p-4 min-w-[320px] max-w-md ${current.border} ${className}`}
    >
      <div className="flex items-start gap-3">
        {current.icon}
        <div className="flex-1 min-w-0 pr-2">
          {title && (
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight mb-0.5">
              {title}
            </h4>
          )}
          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="p-1 -mr-1 -mt-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {durationMs > 0 && onClose && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full transition-all duration-75 ${current.progressBar}`}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
