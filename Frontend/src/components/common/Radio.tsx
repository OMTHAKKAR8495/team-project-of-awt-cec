import React, { forwardRef } from 'react';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, id, className = '', disabled, checked, ...props }, ref) => {
    const radioId =
      id ||
      (typeof label === 'string'
        ? `radio-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : undefined);

    return (
      <label
        htmlFor={radioId}
        className={`group flex items-start gap-2.5 select-none ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0 mt-0.5">
          <input
            id={radioId}
            ref={ref}
            type="radio"
            checked={checked}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={`w-4 h-4 rounded-full border transition-all duration-150 flex items-center justify-center ${
              checked
                ? 'border-indigo-600 bg-white'
                : 'border-slate-300 bg-white group-hover:border-slate-400'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-1`}
          >
            {checked && <div className="w-2 h-2 rounded-full bg-indigo-600 animate-in zoom-in-50" />}
          </div>
        </div>
        {(label || description) && (
          <div className="text-xs min-w-0">
            {label && (
              <span className="font-medium text-slate-800 tracking-tight block">
                {label}
              </span>
            )}
            {description && (
              <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  defaultValue,
  onChange,
  label,
  error,
  hint,
  orientation = 'vertical',
  className = '',
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = React.useState<string>(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const groupId = `radiogroup-${name}`;
  const errorId = `${groupId}-error`;
  const hintId = `${groupId}-hint`;

  return (
    <fieldset
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : hint ? hintId : undefined}
      className={`space-y-2 border-none p-0 m-0 ${className}`}
    >
      {label && (
        <legend className="block text-xs font-semibold text-slate-700 tracking-tight mb-1.5">
          {label}
        </legend>
      )}
      <div
        className={
          orientation === 'horizontal'
            ? 'flex flex-wrap items-center gap-4'
            : 'space-y-2.5'
        }
      >
        {options.map(option => (
          <Radio
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={currentValue === option.value}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
            label={option.label}
            description={option.description}
          />
        ))}
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
    </fieldset>
  );
};

export default Radio;
