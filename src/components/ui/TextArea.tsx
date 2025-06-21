'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled' | 'glass';
  textAreaSize?: 'sm' | 'md' | 'lg';
}

const textAreaVariants = {
  default: 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-[#b09155] focus:border-transparent',
  filled: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-[#b09155] focus:border-[#b09155]',
  glass: 'bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder-gray-300 focus:ring-[#b09155]/50 focus:border-[#b09155]/50'
};

const sizeVariants = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg'
};

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, variant = 'default', textAreaSize = 'md', id, ...props }, ref) => {
    const textAreaId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'textarea';

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={textAreaId}
            className="block text-white font-semibold text-sm"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textAreaId}
          className={cn(
            'w-full rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none',
            textAreaVariants[variant],
            sizeVariants[textAreaSize],
            error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-400 text-sm font-medium">{error}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
