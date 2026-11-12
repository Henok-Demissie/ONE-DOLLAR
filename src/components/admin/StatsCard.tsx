'use client';

import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  iconColor?: string;
  loading?: boolean;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  change,
  iconColor = 'text-gold-400',
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/5" />
          <div className="w-16 h-4 rounded bg-white/5" />
        </div>
        <div className="w-24 h-8 rounded bg-white/5 mb-2" />
        <div className="w-32 h-3 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-white/5 rounded-xl p-6 hover:border-gold-500/20 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={clsx('p-2 rounded-lg bg-white/5', iconColor)}>
          <Icon size={20} />
        </div>
        {change && (
          <span
            className={clsx(
              'text-xs font-medium px-2 py-1 rounded-full',
              change.value >= 0
                ? 'text-green-400 bg-green-500/10'
                : 'text-red-400 bg-red-500/10'
            )}
          >
            {change.value >= 0 ? '+' : ''}
            {change.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
      {change && (
        <p className="text-xs text-white/30 mt-1">{change.label}</p>
      )}
    </div>
  );
}
