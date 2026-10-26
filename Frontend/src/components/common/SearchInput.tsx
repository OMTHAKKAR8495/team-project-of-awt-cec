import React, { forwardRef, useEffect, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {

  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  isLoading?: boolean;
  shortcut?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      defaultValue = '',
      onChange,
      onSearch,
      onClear,
      debounceMs = 300,
      isLoading = false,
      shortcut,
      size = 'md',
      fullWidth = true,
      className = '',
      placeholder = 'Search...',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = useState<string>(
      value !== undefined ? value : defaultValue
    );

    // Sync external value
    useEffect(() => {
      if (value !== undefined) {
        setSearchTerm(value);
      }
    }, [value]);

    // Debounce callback
    useEffect(() => {
      if (!onChange && !onSearch) return;

      const timer = setTimeout(() => {
        onChange?.(searchTerm);
        onSearch?.(searchTerm);
      }, debounceMs);

      return () => clearTimeout(timer);
    }, [searchTerm, debounceMs, onChange, onSearch]);

    const handleClear = () => {
      setSearchTerm('');
      onChange?.('');
      onSearch?.('');
      onClear?.();
    };

    const sizeStyles = {
      sm: 'py-1.5 pl-8 pr-7 text-xs',
      md: 'py-2 pl-9 pr-8 text-sm',
      lg: 'py-2.5 pl-10 pr-9 text-base',
    };

    const iconSizes = {
      sm: 'w-3.5 h-3.5 left-2.5',
      md: 'w-4 h-4 left-3',
      lg: 'w-5 h-5 left-3.5',
    };

    return (
      <div
        className={`relative flex items-center ${
          fullWidth ? 'w-full' : 'w-auto'
        } ${className}`}
      >
        <div
          className={`absolute text-slate-400 pointer-events-none flex items-center shrink-0 ${iconSizes[size]}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={props['aria-label'] || placeholder}
          className={`w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 ${
            sizeStyles[size]
          }`}
          {...props}
        />

        <div className="absolute right-2.5 flex items-center gap-1">
          {searchTerm && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {shortcut && !searchTerm && (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded">
              {shortcut}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
