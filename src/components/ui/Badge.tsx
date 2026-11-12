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
    classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-green-500/15 text-green-400 border-green-500/30',
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
          status === 'pending' && 'bg-yellow-400 animate-pulse',
          status === 'completed' && 'bg-green-400',
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
        'inline-flex items-center rounded-full border border-[#333] bg-[#1a1a1a] px-2.5 py-0.5 text-xs font-medium text-gray-300',
        className
      )}
    >
      {label}
    </span>
  );
}
