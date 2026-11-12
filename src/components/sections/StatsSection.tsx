'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Stats {
  totalRaised: number;
  totalSupporters: number;
  goalAmount: number;
  daysActive: number;
  goalProgress: number;
}

function useCountUp(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (target <= 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatCard({
  icon: Icon,
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  started,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: string;
  started: boolean;
}) {
  const count = useCountUp(decimals > 0 ? Math.round(value * 100) : Math.round(value), 2000, started);
  const displayValue = decimals > 0 ? (count / 100).toFixed(decimals) : count.toLocaleString();

  return (
    <Card className="p-5 flex flex-col justify-between gap-4 bg-[#0d121c]/75 border-white/[0.08] hover:border-[#0DCB3D]/50 hover:shadow-[0_0_25px_rgba(13,203,61,0.2)] backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border bg-[#0DCB3D]/15 text-[#0DCB3D] border-[#0DCB3D]/30 shadow-[0_0_12px_rgba(13,203,61,0.25)]"
        >
          <Icon size={17} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-white font-mono tracking-tight">
          {prefix}
          {displayValue}
          {suffix}
        </p>
      </div>
    </Card>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [stats, setStats] = useState<Stats>({
    totalRaised: 0,
    totalSupporters: 0,
    goalAmount: 1000000,
    daysActive: 1,
    goalProgress: 0,
  });

  useEffect(() => {
    fetch('/api/public/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Stats fetch failed');
        return r.json();
      })
      .then((data) => {
        if (data && typeof data.total_raised_usd === 'number') {
          const totalRaised = data.total_raised_usd;
          const totalSupporters = data.supporter_count ?? 0;
          const goalAmount = data.goal_amount ?? 1000000;
          const daysActive = data.days_active ?? 1;
          const goalProgress = goalAmount > 0 ? (totalRaised / goalAmount) * 100 : 0;
          setStats({
            totalRaised,
            totalSupporters,
            goalAmount,
            daysActive,
            goalProgress,
          });
        }
      })
      .catch(() => {
        setStats({
          totalRaised: 0,
          totalSupporters: 0,
          goalAmount: 1000000,
          daysActive: 1,
          goalProgress: 0,
        });
      });
  }, []);

  return (
    <section id="stats" ref={ref} className="py-20 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-[#0DCB3D] bg-[#0DCB3D]/10 border border-[#0DCB3D]/30 mb-3 backdrop-blur-md shadow-[0_0_12px_rgba(13,203,61,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D] animate-pulse" />
            <span>Live Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-['Outfit']">
            The dream in{' '}
            <span className="bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_15px_rgba(13,203,61,0.4)]">
              numbers
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Every dollar matters. All metrics update live from on-chain transactions and verified bank deposits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={DollarSign}
            label="Total Raised (USD)"
            value={stats.totalRaised}
            prefix="$"
            started={inView}
          />
          <StatCard
            icon={Users}
            label="Total Supporters"
            value={stats.totalSupporters}
            started={inView}
          />
          <StatCard
            icon={TrendingUp}
            label="Goal Progress"
            value={stats.goalProgress}
            decimals={2}
            suffix="%"
            started={inView}
          />
          <StatCard
            icon={Calendar}
            label="Days Active"
            value={stats.daysActive}
            started={inView}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-6 border-white/[0.08] hover:border-[#0DCB3D]/40 transition-colors">
            <ProgressBar
              value={stats.goalProgress}
              raised={stats.totalRaised}
              goal={stats.goalAmount}
              label="Campaign Goal Progress"
              size="lg"
            />
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
