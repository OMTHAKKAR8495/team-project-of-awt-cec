import React, { forwardRef } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, showCount = false, maxLength, id, className = '', value, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = textareaId ? `${textareaId}-error` : undefined;
    const hintId = textareaId ? `${textareaId}-hint` : undefined;

    const currentLength =
      typeof value === 'string'
        ? value.length
        : typeof props.defaultValue === 'string'
          ? props.defaultValue.length
          : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs font-semibold text-slate-700 tracking-tight"
            >
              {label}
              {props.required && <span className="text-rose-500 ml-1">*</span>}
            </label>
          )}
          {showCount && maxLength && (
            <span className="text-[11px] text-slate-400 font-mono">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 resize-y min-h-[90px] ${
            error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
          } ${className}`}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export default Textarea;

