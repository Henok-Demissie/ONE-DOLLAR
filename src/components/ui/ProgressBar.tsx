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
          <span className="text-sm font-bold text-[#0DCB3D] font-mono drop-shadow-[0_0_8px_rgba(13,203,61,0.5)]">
            {clamped.toFixed(1)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-[#0d1219] border border-white/[0.08]',
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-[#0AA832] via-[#0DCB3D] to-[#1EE94F] shadow-[0_0_16px_rgba(13,203,61,0.65)] relative overflow-hidden"
        >
          {/* shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.div>
      </div>

      {(raised !== undefined || goal !== undefined) && (
        <div className="flex items-center justify-between mt-1.5 font-mono">
          {raised !== undefined && (
            <span className="text-xs text-slate-400 font-sans">
              Raised:{' '}
              <span className="text-[#0DCB3D] font-mono font-bold drop-shadow-[0_0_8px_rgba(13,203,61,0.4)]">
                ${raised.toLocaleString()}
              </span>
            </span>
          )}
          {goal !== undefined && (
            <span className="text-xs text-slate-400 font-sans">
              Goal: <span className="text-white font-mono font-semibold">${goal.toLocaleString()}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
