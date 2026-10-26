import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      id,
      className = '',
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const hintId = inputId ? `${inputId}-hint` : undefined;

    const showClearButton = clearable && Boolean(value) && !props.disabled && Boolean(onClear);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 tracking-tight"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            value={value}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon || showClearButton ? 'pr-9' : ''} ${
              error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
            } ${className}`}
            {...props}
          />
          {showClearButton ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear input"
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center shrink-0">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 font-medium" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-xs text-slate-500">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

