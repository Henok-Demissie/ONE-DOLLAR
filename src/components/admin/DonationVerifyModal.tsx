'use client';

import { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface Donation {
  id: string;
  donor_name: string;
  donor_email?: string;
  amount_usd: number;
  currency: string;
  tx_hash?: string;
  status: string;
  created_at: string;
}

interface DonationVerifyModalProps {
  donation: Donation | null;
  onClose: () => void;
  onVerified: () => void;
}

export function DonationVerifyModal({
  donation,
  onClose,
  onVerified,
}: DonationVerifyModalProps) {
  const [txHash, setTxHash] = useState(donation?.tx_hash ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!donation) return null;

  const handleVerify = async () => {
    if (!txHash.trim()) {
      setError('Transaction hash is required for verification.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/donations/${donation.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tx_hash: txHash.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Verification failed');
      }
      onVerified();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-lg font-semibold text-white">Verify Donation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-300">
              <strong>Only verify after blockchain confirmation.</strong> Incorrect
              verifications cannot be automatically reversed.
            </p>
          </div>

          {/* Donation Details */}
          <div className="bg-black/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Donor</span>
              <span className="text-white font-medium">{donation.donor_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Amount</span>
              <span className="text-gold-400 font-semibold">${Number(donation.amount_usd).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Currency</span>
              <span className="text-white">{donation.currency}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-white/40">Status</span>
              <StatusBadge status={donation.status} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Date</span>
              <span className="text-white">{new Date(donation.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* TX Hash Input */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Transaction Hash <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x... or blockchain tx hash"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 font-mono"
            />
            <p className="mt-1 text-xs text-white/30">
              Paste the transaction hash from the blockchain explorer
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-white/5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || !txHash.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Verifying…' : 'Confirm Verified'}
          </button>
        </div>
      </div>
    </div>
  );
}
