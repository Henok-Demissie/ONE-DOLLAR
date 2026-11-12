'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-[#0d0d0d] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-colors duration-200',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/70 focus:ring-red-500/30 focus:border-red-500'
              : 'border-[#333] focus:ring-amber-500/30 focus:border-amber-500/70',
            props.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-[#0d0d0d] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-colors duration-200 resize-none',
            'focus:outline-none focus:ring-2',
            error
              ? 'border-red-500/70 focus:ring-red-500/30 focus:border-red-500'
              : 'border-[#333] focus:ring-amber-500/30 focus:border-amber-500/70',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
