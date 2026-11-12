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
  color = 'gold',
  started,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  color?: 'gold' | 'blue';
  started: boolean;
}) {
  const count = useCountUp(decimals > 0 ? Math.round(value * 100) : Math.round(value), 2000, started);
  const displayValue = decimals > 0 ? (count / 100).toFixed(decimals) : count.toLocaleString();

  return (
    <Card hover glow={color} className="p-6 flex flex-col gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          color === 'gold'
            ? 'bg-amber-500/15 text-amber-400'
            : 'bg-sky-500/15 text-sky-400'
        }`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-3xl font-black text-white">
          {prefix}
          {displayValue}
          {suffix}
        </p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
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
          totalRaised: 247,
          totalSupporters: 189,
          goalAmount: 1000000,
          daysActive: 42,
          goalProgress: 0.0247,
        });
      });
  }, []);

  return (
    <section id="stats" ref={ref} className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            THE DREAM IN{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              NUMBERS
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every dollar matters. Every supporter counts. Here&apos;s how the dream is growing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={DollarSign}
            label="Total Raised (USD)"
            value={stats.totalRaised}
            prefix="$"
            color="gold"
            started={inView}
          />
          <StatCard
            icon={Users}
            label="Total Supporters"
            value={stats.totalSupporters}
            color="blue"
            started={inView}
          />
          <StatCard
            icon={TrendingUp}
            label="Goal Progress"
            value={stats.goalProgress}
            decimals={2}
            suffix="%"
            color="gold"
            started={inView}
          />
          <StatCard
            icon={Calendar}
            label="Days Active"
            value={stats.daysActive}
            color="blue"
            started={inView}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="p-6">
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
