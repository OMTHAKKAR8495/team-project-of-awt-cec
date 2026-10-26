import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'indigo' | 'white' | 'slate' | 'current';
  label?: string;
  className?: string;
  center?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'indigo',
  label,
  className = '',
  center = false,
}) => {
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantStyles = {
    indigo: 'text-indigo-600',
    white: 'text-white',
    slate: 'text-slate-400',
    current: 'text-current',
  };

  const content = (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <Loader2
        className={`animate-spin shrink-0 ${sizeStyles[size]} ${variantStyles[variant]}`}
      />
      {label && (
        <span className="text-xs font-medium text-slate-500 tracking-tight">
          {label}
        </span>
      )}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center p-8 w-full min-h-[140px]">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
