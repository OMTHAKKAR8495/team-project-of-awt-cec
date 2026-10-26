import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'auto';
  striped?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'auto',
  striped = false,
  animated = false,
  className = '',
}) => {
  const clampedValue = Math.max(0, Math.min(max, value));
  const percentage = Math.round((clampedValue / max) * 100);

  const getVariantClasses = (pct: number) => {
    if (variant !== 'auto') {
      const explicitVariants = {
        indigo: 'bg-indigo-600',
        emerald: 'bg-emerald-600',
        amber: 'bg-amber-500',
        rose: 'bg-rose-600',
      };
      return explicitVariants[variant];
    }

    // Auto threshold matching ScoreRing
    if (pct >= 80) return 'bg-emerald-600';
    if (pct >= 60) return 'bg-indigo-600';
    if (pct >= 40) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  const sizeStyles = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="font-medium text-slate-700 tracking-tight">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-mono text-slate-500 text-[11px] ml-auto">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `${percentage}% progress`}
        className={`w-full overflow-hidden rounded-full bg-slate-100 ${sizeStyles[size]}`}
      >
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-500 ease-out ${getVariantClasses(
            percentage
          )} ${striped ? 'bg-stripe' : ''} ${animated ? 'animate-pulse' : ''}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
