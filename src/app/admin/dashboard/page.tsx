'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Users,
  Clock,
  Briefcase,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatDistanceToNow } from 'date-fns';

interface StatsResponse {
  total_donations: number;
  total_raised_usd: number;
  supporter_count: number;
  goal_amount: number;
  progress_percentage: number;
  status_counts: {
    completed: number;
    pending: number;
    failed: number;
    expired: number;
  };
  recent_transactions: RecentDonation[];
  hire_request_count: number;
}

interface RecentDonation {
  id: string;
  donor_name: string;
  amount_usd: number;
  currency: string;
  status: string;
  created_at: string;
}

interface RecentHireRequest {
  id: string;
  client_name: string;
  project_type: string;
  budget_range: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [hireRequests, setHireRequests] = useState<RecentHireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setError('');
    try {
      const [statsRes, hireRes] = await Promise.all([
        fetch('/api/admin/stats', { cache: 'no-store' }),
        fetch('/api/admin/hire-requests?page=1&per_page=5', { cache: 'no-store' }),
      ]);

      if (statsRes.ok) {
        const s: StatsResponse = await statsRes.json();
        setStats(s);
        setDonations(s.recent_transactions ?? []);
      } else {
        setError('Failed to load dashboard statistics.');
      }

      if (hireRes.ok) {
        const h = await hireRes.json();
        setHireRequests(h.hire_requests ?? []);
      }
    } catch {
      setError('Unable to reach server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRaised = stats?.total_raised_usd ?? 0;
  const goalAmount = stats?.goal_amount ?? 1_000_000;
  const goalPercent = stats?.progress_percentage ?? Math.min(100, (totalRaised / goalAmount) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          icon={DollarSign}
          label="Total Raised"
          value={
            stats
              ? `$${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : '—'
          }
          iconColor="text-gold-400"
          loading={loading}
        />
        <StatsCard
          icon={Users}
          label="Supporters"
          value={stats?.supporter_count ?? '—'}
          iconColor="text-blue-400"
          loading={loading}
        />
        <StatsCard
          icon={Clock}
          label="Pending Verifications"
          value={stats?.status_counts?.pending ?? '—'}
          iconColor="text-[#0DCB3D]"
          loading={loading}
        />
        <StatsCard
          icon={Briefcase}
          label="Hire Requests"
          value={stats?.hire_request_count ?? '—'}
          iconColor="text-purple-400"
          loading={loading}
        />
      </div>

      {/* Goal Progress */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-gold-400" />
              Fundraising Progress
            </h2>
            <p className="text-white/40 text-sm mt-0.5">
              Journey to ${goalAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gold-400">
              {goalPercent.toFixed(2)}%
            </p>
            <p className="text-xs text-white/30">of goal</p>
          </div>
        </div>

        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700"
            style={{ width: `${goalPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/30">
            ${totalRaised.toLocaleString()} raised
          </span>
          <span className="text-xs text-white/30">
            Goal: ${goalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/donations"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/20 text-sm font-medium hover:bg-gold-500/25 transition-colors"
        >
          <CheckCircle size={16} />
          Verify Payments
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/admin/hire-requests"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-white/70 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <Briefcase size={16} />
          Review Hire Requests
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Recent Donations */}
      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
          <Link
            href="/admin/donations"
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">When</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-3">
                        <div className="h-4 bg-white/5 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/30 text-sm">
                    No donations yet
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3 text-sm text-white">{d.donor_name}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gold-400">
                      ${Number(d.amount_usd).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-sm text-white/60">{d.currency}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-white/40">
                      {formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Hire Requests */}
      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Recent Hire Requests</h2>
          <Link
            href="/admin/hire-requests"
            className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Project Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">When</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-3">
                        <div className="h-4 bg-white/5 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : hireRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-white/30 text-sm">
                    No hire requests yet
                  </td>
                </tr>
              ) : (
                hireRequests.map((h) => (
                  <tr key={h.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3 text-sm text-white">{h.client_name}</td>
                    <td className="px-6 py-3 text-sm text-white/60">{h.project_type}</td>
                    <td className="px-6 py-3 text-sm text-white/60">{h.budget_range}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={h.status} />
                    </td>
                    <td className="px-6 py-3 text-sm text-white/40">
                      {formatDistanceToNow(new Date(h.created_at), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
