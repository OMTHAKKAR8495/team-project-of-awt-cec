import React from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'square' | 'rounded' | 'circle';
  isLoading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  shape = 'rounded',
  isLoading = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer shrink-0';

  const shapeStyles = {
    square: 'rounded-none',
    rounded: 'rounded-lg',
    circle: 'rounded-full',
  };

  const sizeStyles = {
    xs: 'w-6 h-6 text-xs p-1',
    sm: 'w-8 h-8 text-sm p-1.5',
    md: 'w-9 h-9 text-base p-2',
    lg: 'w-11 h-11 text-lg p-2.5',
  };

  const variantStyles = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 shadow-sm shadow-indigo-200',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:ring-indigo-500 shadow-xs',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-sm shadow-rose-200',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500 shadow-sm shadow-emerald-200',
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${shapeStyles[shape]} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <span className="inline-flex items-center justify-center shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default IconButton;
