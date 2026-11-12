'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, X, Loader2, Building2, Calendar, Mail, DollarSign, FileText } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface HireRequest {
  id: string;
  client_name: string;
  email: string;
  company?: string;
  project_type: string;
  budget_range: string;
  description: string;
  deadline?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | string;
  admin_notes?: string;
  created_at: string;
}

const STATUS_OPTIONS = ['pending', 'reviewed', 'accepted', 'rejected'] as const;

export default function AdminHireRequestsPage() {
  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<HireRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const filterStatus = statusFilter === 'rejected' ? 'declined' : statusFilter;
      const url =
        statusFilter !== 'all'
          ? `/api/admin/hire-requests?per_page=100&status=${encodeURIComponent(filterStatus)}`
          : '/api/admin/hire-requests?per_page=100';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.hire_requests ?? []);
      } else {
        toast.error('Failed to load hire requests');
      }
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (id: string, status: string, notes?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/hire-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to update status');
      }
      const data = await res.json();
      toast.success(`Marked as ${status}`);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data.hire_request } : r))
      );
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, ...data.hire_request } : null));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const openDetails = (row: HireRequest) => {
    setSelected(row);
    setAdminNotes(row.admin_notes ?? '');
  };

  const columns: Column<HireRequest>[] = [
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (v) => (
        <span className="text-white/60 text-xs">
          {format(new Date(String(v)), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      key: 'client_name',
      label: 'Client',
      sortable: true,
      render: (v, row) => (
        <div>
          <p className="text-white font-medium text-sm">{String(v)}</p>
          {row.company && <p className="text-white/40 text-xs">{row.company}</p>}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (v) => (
        <a
          href={`mailto:${String(v)}`}
          className="text-white/70 hover:text-gold-400 text-xs transition-colors"
        >
          {String(v)}
        </a>
      ),
    },
    {
      key: 'project_type',
      label: 'Project Type',
      sortable: true,
    },
    {
      key: 'budget_range',
      label: 'Budget',
      sortable: true,
      render: (v) => <span className="text-gold-400 font-medium text-sm">{String(v)}</span>,
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDetails(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Eye size={12} />
            Details
          </button>
          <select
            value={row.status === 'declined' ? 'rejected' : row.status}
            disabled={updatingId === row.id}
            onChange={(e) => handleStatusUpdate(row.id, e.target.value, row.admin_notes)}
            className="bg-black/40 border border-white/10 rounded-md px-2 py-1 text-xs text-white/80 focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hire Requests</h1>
          <p className="text-white/40 text-sm mt-1">
            Review incoming client inquiries and update their status
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-gold-500/50"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        keyField="id"
        pageSize={15}
        emptyMessage="No hire requests found"
      />

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold text-white">{selected.client_name}</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Submitted {format(new Date(selected.created_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                    <Mail size={12} />
                    Email
                  </div>
                  <p className="text-sm text-white break-all">{selected.email}</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                    <Building2 size={12} />
                    Company
                  </div>
                  <p className="text-sm text-white">{selected.company || 'Not specified'}</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                    <DollarSign size={12} />
                    Budget &amp; Type
                  </div>
                  <p className="text-sm text-gold-400 font-medium">
                    {selected.budget_range} · {selected.project_type}
                  </p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1">
                    <Calendar size={12} />
                    Deadline
                  </div>
                  <p className="text-sm text-white">{selected.deadline || 'Flexible / Not set'}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  <FileText size={12} />
                  Project Description
                </div>
                <div className="bg-black/30 border border-white/5 rounded-lg p-4 text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                  {selected.description}
                </div>
              </div>

              {/* Admin notes */}
              <div>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  placeholder="Optional internal notes…"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              {/* Status actions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Update Status
                  </span>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STATUS_OPTIONS.map((status) => {
                    const isCurrent =
                      selected.status === status ||
                      (status === 'rejected' && selected.status === 'declined');
                    return (
                      <button
                        key={status}
                        disabled={updatingId === selected.id}
                        onClick={() => handleStatusUpdate(selected.id, status, adminNotes)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'bg-gold-500 text-black border-gold-500 font-semibold'
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {updatingId === selected.id && <Loader2 size={12} className="animate-spin" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
