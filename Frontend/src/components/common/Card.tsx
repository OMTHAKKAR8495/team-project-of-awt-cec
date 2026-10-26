import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'glass' | 'outline' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/90 shadow-xs text-slate-900',
    glass: 'nexus-glass-card text-slate-100',
    outline: 'bg-transparent border border-slate-200/90 text-slate-900',
    flat: 'bg-slate-50 border border-transparent text-slate-900',
  };

  const hoverStyle = hoverable
    ? variant === 'glass'
      ? 'hover:border-indigo-500/40 hover:shadow-lg transition-all duration-200'
      : 'hover:border-slate-300 hover:shadow-md transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl ${variantStyles[variant]} ${hoverStyle} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  if (children) {
    return (
      <div className={`p-5 sm:p-6 border-b border-slate-100/80 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`p-5 sm:p-6 border-b border-slate-100/80 flex items-start justify-between gap-4 ${className}`}
    >
      <div>
        {title && (
          <h2 className="text-base sm:text-lg font-semibold tracking-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`p-4 sm:px-6 bg-slate-50/70 border-t border-slate-100/80 rounded-b-xl flex items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

