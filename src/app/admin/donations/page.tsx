'use client';

import { useEffect, useState, useCallback } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DonationVerifyModal } from '@/components/admin/DonationVerifyModal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  amount_usd: number;
  currency: string;
  tx_hash?: string;
  status: string;
  created_at: string;
  wallet_address?: string;
  network?: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filtered, setFiltered] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [verifyDonation, setVerifyDonation] = useState<Donation | null>(null);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/donations?per_page=100', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDonations(data.donations ?? []);
      } else {
        toast.error('Failed to load donations');
      }
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Filter logic
  useEffect(() => {
    let result = [...donations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.donor_name.toLowerCase().includes(q) ||
          d.donor_email?.toLowerCase().includes(q) ||
          d.tx_hash?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter((d) => d.status === statusFilter);
    if (currencyFilter !== 'all') result = result.filter((d) => d.currency === currencyFilter);
    if (dateFrom) result = result.filter((d) => new Date(d.created_at) >= new Date(dateFrom));
    if (dateTo) result = result.filter((d) => new Date(d.created_at) <= new Date(dateTo + 'T23:59:59'));
    setFiltered(result);
  }, [donations, search, statusFilter, currencyFilter, dateFrom, dateTo]);

  const handleReject = async (id: string) => {
    if (!confirm('Reject this donation?')) return;
    try {
      const res = await fetch(`/api/admin/donations/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Rejected by admin' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to reject');
      }
      toast.success('Donation rejected');
      fetchDonations();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject donation');
    }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Donor Name', 'Email', 'Amount (USD)', 'Currency', 'TX Hash', 'Status'];
    const rows = filtered.map((d) => [
      format(new Date(d.created_at), 'yyyy-MM-dd HH:mm'),
      d.donor_name,
      d.donor_email ?? '',
      Number(d.amount_usd).toFixed(2),
      d.currency,
      d.tx_hash ?? '',
      d.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currencies = Array.from(new Set(donations.map((d) => d.currency)));

  const columns: Column<Donation>[] = [
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (v) => (
        <span className="text-white/60 text-xs">{format(new Date(String(v)), 'MMM d, yyyy HH:mm')}</span>
      ),
    },
    {
      key: 'donor_name',
      label: 'Donor',
      sortable: true,
      render: (v, row) => (
        <div>
          <p className="text-white text-sm">{String(v)}</p>
          <p className="text-white/40 text-xs">{row.donor_email}</p>
        </div>
      ),
    },
    {
      key: 'amount_usd',
      label: 'Amount',
      sortable: true,
      render: (v) => (
        <span className="text-gold-400 font-semibold">${Number(v).toFixed(2)}</span>
      ),
    },
    { key: 'currency', label: 'Currency', sortable: true },
    {
      key: 'tx_hash',
      label: 'TX Hash',
      render: (v) =>
        v ? (
          <span className="font-mono text-xs text-white/50 truncate max-w-[140px] block" title={String(v)}>
            {String(v).slice(0, 16)}…
          </span>
        ) : (
          <span className="text-white/20 text-xs">—</span>
        ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (v) => <StatusBadge status={String(v)} />,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_v, row) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => setVerifyDonation(row)}
                className="px-2.5 py-1 text-xs rounded-md bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 transition-colors"
              >
                Verify
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="px-2.5 py-1 text-xs rounded-md bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Donations</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} records</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 hover:bg-white/10 transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor, email, tx hash…"
              className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-gold-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-gold-500/50"
          >
            <option value="all">All Currencies</option>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex gap-2 items-center">
            <Filter size={14} className="text-white/30 flex-shrink-0" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 focus:outline-none focus:border-gold-500/50"
            />
            <span className="text-white/20 text-xs">–</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2 py-2 text-xs text-white/70 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        keyField="id"
        pageSize={15}
        emptyMessage="No donations match your filters"
      />

      {/* Verify Modal */}
      {verifyDonation && (
        <DonationVerifyModal
          donation={verifyDonation}
          onClose={() => setVerifyDonation(null)}
          onVerified={() => {
            toast.success('Donation verified successfully!');
            fetchDonations();
          }}
        />
      )}
    </div>
  );
}
