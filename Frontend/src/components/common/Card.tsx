import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#0d122e]/90 rounded-xl border border-slate-200/90 dark:border-indigo-500/20 shadow-xs text-slate-900 dark:text-slate-100 ${
        hoverable ? 'hover:border-slate-300 dark:hover:border-indigo-500/40 hover:shadow-md transition-all duration-200' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
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
      <div className={`p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 ${className}`}
    >
      <div>
        {title && (
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
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
      className={`p-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 rounded-b-xl flex items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
