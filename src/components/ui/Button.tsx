'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold hover:from-amber-400 hover:to-yellow-300 shadow-lg shadow-amber-500/25 border-0',
  secondary:
    'border-2 border-amber-500 text-amber-400 bg-transparent hover:bg-amber-500/10 font-semibold',
  ghost:
    'border border-white/10 text-gray-300 bg-transparent hover:bg-white/5 hover:text-white',
  danger:
    'bg-red-600 text-white font-semibold hover:bg-red-500 shadow-lg shadow-red-600/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as any)}
      >
        {loading && <Loader2 className="animate-spin shrink-0" size={16} />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
