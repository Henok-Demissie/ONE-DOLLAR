'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  goal?: number;
  raised?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  goal,
  raised,
  label,
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            {label || 'Goal Progress'}
          </span>
          <span className="text-sm font-bold text-amber-400">{clamped.toFixed(1)}%</span>
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-[#1a1a1a] border border-[#333]',
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 relative overflow-hidden"
        >
          {/* shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        </motion.div>
      </div>

      {(raised !== undefined || goal !== undefined) && (
        <div className="flex items-center justify-between mt-1.5">
          {raised !== undefined && (
            <span className="text-xs text-gray-500">
              Raised: <span className="text-amber-400 font-semibold">${raised.toLocaleString()}</span>
            </span>
          )}
          {goal !== undefined && (
            <span className="text-xs text-gray-500">
              Goal: <span className="text-gray-300 font-semibold">${goal.toLocaleString()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
