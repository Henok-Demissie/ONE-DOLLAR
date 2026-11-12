'use client';

import { clsx } from 'clsx';

type Status =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'reviewed'
  | 'accepted'
  | 'rejected'
  | string;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-white/[0.08] text-slate-300 border-white/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#0DCB3D]/20 text-[#0DCB3D] border-[#0DCB3D]/40',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  expired: {
    label: 'Expired',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  reviewed: {
    label: 'Reviewed',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  declined: {
    label: 'Rejected',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
}
