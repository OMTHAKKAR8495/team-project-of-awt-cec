import React from 'react';

export interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color theme based on score thresholds
  const getColorClasses = (val: number) => {
    if (val >= 80) {
      return {
        stroke: 'stroke-emerald-600',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'text-emerald-700 bg-emerald-100/70',
        label: 'Strong Match',
      };
    }
    if (val >= 60) {
      return {
        stroke: 'stroke-indigo-600',
        text: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        badge: 'text-indigo-700 bg-indigo-100/70',
        label: 'Moderate Match',
      };
    }
    if (val >= 40) {
      return {
        stroke: 'stroke-amber-500',
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badge: 'text-amber-700 bg-amber-100/70',
        label: 'Partial Match',
      };
    }
    return {
      stroke: 'stroke-rose-600',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'text-rose-700 bg-rose-100/70',
      label: 'Low Match',
    };
  };

  const colors = getColorClasses(clampedScore);

  const dimensions = {
    sm: { diameter: 48, strokeWidth: 4, textSize: 'text-xs', labelText: 'text-[10px]' },
    md: { diameter: 80, strokeWidth: 6, textSize: 'text-xl', labelText: 'text-xs' },
    lg: { diameter: 120, strokeWidth: 8, textSize: 'text-3xl', labelText: 'text-sm' },
  };

  const { diameter, strokeWidth, textSize } = dimensions[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className={`${colors.stroke} transition-all duration-700 ease-out`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${textSize} ${colors.text} tracking-tight leading-none`}>
            {clampedScore}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">/100</span>
          )}
        </div>
      </div>

      {showLabel && size !== 'sm' && (
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${colors.badge}`}
        >
          {colors.label}
        </span>
      )}
    </div>
  );
};

export default ScoreRing;
