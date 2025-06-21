'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled' | 'glass';
  selectSize?: 'sm' | 'md' | 'lg';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const selectVariants = {
  default: 'bg-white/10 border-white/20 text-white focus:ring-[#b09155] focus:border-transparent',
  filled: 'bg-gray-800 border-gray-700 text-white focus:ring-[#b09155] focus:border-[#b09155]',
  glass: 'bg-white/5 backdrop-blur-sm border-white/10 text-white focus:ring-[#b09155]/50 focus:border-[#b09155]/50'
};

const sizeVariants = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg'
};

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, variant = 'default', selectSize = 'md', id, options, placeholder, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'select';

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-white font-semibold text-sm"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
            selectVariants[variant],
            sizeVariants[selectSize],
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-gray-800">
              {placeholder}
            </option>
          )}
          {options ? (
            options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800">
                {option.label}
              </option>
            ))
          ) : (
            children
          )}
        </select>
        {error && (
          <p className="text-red-400 text-sm font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
