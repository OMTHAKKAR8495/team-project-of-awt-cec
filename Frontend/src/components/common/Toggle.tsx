import React, { forwardRef } from 'react';

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      size = 'md',
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const toggleId =
      id ||
      (typeof label === 'string'
        ? `toggle-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : undefined);

    const sizeStyles = {
      sm: {
        track: 'w-7 h-4',
        knob: 'w-3 h-3',
        translate: 'translate-x-3',
      },
      md: {
        track: 'w-10 h-5.5',
        knob: 'w-4 h-4',
        translate: 'translate-x-4.5',
      },
      lg: {
        track: 'w-12 h-6.5',
        knob: 'w-5 h-5',
        translate: 'translate-x-5.5',
      },
    };

    const currentSize = sizeStyles[size];

    return (
      <div className={`flex items-start justify-between gap-3 ${className}`}>
        {(label || description) && (
          <div className="text-xs min-w-0 flex-1">
            {label && (
              <label
                htmlFor={toggleId}
                onClick={() => !disabled && onChange(!checked)}
                className={`font-medium text-slate-800 tracking-tight block select-none ${
                  disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <button
          id={toggleId}
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 select-none cursor-pointer ${
            currentSize.track
          } ${
            checked ? 'bg-indigo-600' : 'bg-slate-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block rounded-full bg-white shadow-xs transform ring-0 transition duration-200 ease-in-out ${
              currentSize.knob
            } ${checked ? currentSize.translate : 'translate-x-0.5'}`}
          />
        </button>
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
