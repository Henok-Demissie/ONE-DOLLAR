'use client';

import { cn } from '@/lib/utils';

type BadgeStatus = 'pending' | 'completed' | 'failed' | 'expired';
type BadgeVariant = 'default' | 'outline';

interface BadgeProps {
  status?: BadgeStatus;
  label?: string;
  variant?: BadgeVariant;
  className?: string;
}

const statusConfig: Record<BadgeStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Pending',
    classes: 'bg-white/[0.08] text-slate-300 border-white/20',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-[#0DCB3D]/20 text-[#0DCB3D] border-[#0DCB3D]/40 shadow-[0_0_10px_rgba(13,203,61,0.2)]',
  },
  failed: {
    label: 'Failed',
    classes: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  expired: {
    label: 'Expired',
    classes: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  },
};

export function Badge({ status, label, variant = 'default', className }: BadgeProps) {
  if (status) {
    const config = statusConfig[status];
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
          config.classes,
          className
        )}
      >
        <span className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'pending' && 'bg-slate-400 animate-pulse',
          status === 'completed' && 'bg-[#0DCB3D]',
          status === 'failed' && 'bg-red-400',
          status === 'expired' && 'bg-gray-400',
        )} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-xs font-semibold text-slate-300 backdrop-blur-md',
        className
      )}
    >
      {label}
    </span>
  );
}
