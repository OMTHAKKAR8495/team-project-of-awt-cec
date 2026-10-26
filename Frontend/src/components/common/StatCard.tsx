import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from 'lucide-react';
import Card from './Card';
import { StatCardSkeleton } from './LoadingSkeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon | React.ReactNode;
  description?: string;
  change?: {
    value: string | number;
    trend: 'positive' | 'negative' | 'neutral';
    label?: string;
  };
  isLoading?: boolean;
  variant?: 'default' | 'glass';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: IconOrElement,
  description,
  change,
  isLoading = false,
  variant = 'default',
  className = '',
  onClick,
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const renderIcon = () => {
    if (!IconOrElement) return null;
    if (React.isValidElement(IconOrElement)) {
      return IconOrElement;
    }
    const IconComponent = IconOrElement as LucideIcon;
    return <IconComponent className="w-5 h-5 text-indigo-600" />;
  };

  const trendStyles = {
    positive: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
    negative: 'text-rose-700 bg-rose-50 border-rose-200/80',
    neutral: 'text-slate-600 bg-slate-50 border-slate-200/80',
  };

  const TrendIcon =
    change?.trend === 'positive'
      ? ArrowUpRight
      : change?.trend === 'negative'
        ? ArrowDownRight
        : Minus;

  return (
    <Card
      variant={variant}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      className={`p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {IconOrElement && (
          <div className="w-9 h-9 rounded-lg bg-indigo-50/80 flex items-center justify-center shrink-0">
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>

        {change && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded border ${
              trendStyles[change.trend]
            }`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{change.value}</span>
          </span>
        )}
      </div>

      {(description || change?.label) && (
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {change?.label ? `${change.label} • ` : ''}
          {description}
        </p>
      )}
    </Card>
  );
};

export default StatCard;
