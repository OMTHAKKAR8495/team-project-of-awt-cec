import React from 'react';
import { ApplicationStatus } from '../../types/candidate';
import { EmploymentType, JobStatus } from '../../types/job';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'indigo'
    | 'success'
    | 'warning'
    | 'danger'
    | 'neutral'
    | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-slate-50 text-slate-600 border border-slate-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full capitalize leading-none tracking-tight ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const JobStatusBadge: React.FC<{ status: JobStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  if (status === 'open') {
    return (
      <Badge variant="success" size={size}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Open
      </Badge>
    );
  }
  return (
    <Badge variant="neutral" size={size}>
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Closed
    </Badge>
  );
};

export const ApplicationStatusBadge: React.FC<{
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Pending Review
        </Badge>
      );
    case 'shortlisted':
      return (
        <Badge variant="indigo" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Shortlisted
        </Badge>
      );
    case 'hired':
      return (
        <Badge variant="success" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Hired
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rejected
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};

export const EmploymentTypeBadge: React.FC<{
  type: EmploymentType;
  size?: 'sm' | 'md';
}> = ({ type, size = 'sm' }) => {
  const labelMap: Record<EmploymentType, string> = {
    'full-time': 'Full-Time',
    'part-time': 'Part-Time',
    contract: 'Contract',
    internship: 'Internship',
    remote: 'Remote',
  };

  return (
    <Badge variant="info" size={size}>
      {labelMap[type] || type}
    </Badge>
  );
};

export default Badge;
