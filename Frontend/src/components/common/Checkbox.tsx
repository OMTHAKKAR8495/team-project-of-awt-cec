import React, { forwardRef, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      hint,
      error,
      indeterminate = false,
      id,
      className = '',
      disabled,
      checked,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (forwardedRef as React.RefObject<HTMLInputElement>) || internalRef;

    const checkboxId =
      id ||
      (typeof label === 'string'
        ? `chk-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : undefined);
    const errorId = checkboxId ? `${checkboxId}-error` : undefined;
    const hintId = checkboxId ? `${checkboxId}-hint` : undefined;

    useEffect(() => {
      if (resolvedRef && 'current' in resolvedRef && resolvedRef.current) {
        resolvedRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate, resolvedRef]);

    const isChecked = Boolean(checked) || Boolean(indeterminate);

    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`group flex items-start gap-2.5 select-none ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
        >
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              id={checkboxId}
              ref={resolvedRef}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : hint ? hintId : undefined}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center ${
                isChecked
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-300 group-hover:border-slate-400 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-1'
              } ${error ? 'border-rose-400 bg-rose-50/50' : ''}`}
            >
              {indeterminate ? (
                <Minus className="w-3 h-3 stroke-[3]" />
              ) : (
                checked && <Check className="w-3 h-3 stroke-[3]" />
              )}
            </div>
          </div>
          {(label || hint) && (
            <div className="text-xs min-w-0">
              {label && (
                <span className="font-medium text-slate-800 tracking-tight block">
                  {label}
                  {props.required && <span className="text-rose-500 ml-0.5">*</span>}
                </span>
              )}
              {hint && !error && (
                <p id={hintId} className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                  {hint}
                </p>
              )}
            </div>
          )}
        </label>
        {error && (
          <p id={errorId} className="text-xs text-rose-600 font-medium ml-6.5" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
