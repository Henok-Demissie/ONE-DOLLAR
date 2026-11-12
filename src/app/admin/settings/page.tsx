'use client';

import { useState } from 'react';
import {
  Wallet,
  Target,
  ShieldAlert,
  ExternalLink,
  Copy,
  Check,
  Info,
  Building2,
} from 'lucide-react';
import { SITE_CONFIG, SUPPORTED_CRYPTOS, BANK_TRANSFER_DETAILS } from '@/lib/constants';

export default function AdminSettingsPage() {
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const handleCopy = (symbol: string, wallet: string) => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">
          Payment integration status, crypto wallets, and platform configuration
        </p>
      </div>

      {/* Payment Integration Status */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#0DCB3D]/10 text-[#0DCB3D]">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Payment Integration Status</h2>
              <p className="text-xs text-white/40">Active donation settlement method</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#0DCB3D]/15 text-[#0DCB3D] border border-[#0DCB3D]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
            Crypto Wallet Mode - Admin Verification Required
          </span>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2.5 text-sm text-white/70">
            <Info size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Card-to-Crypto On-Ramp (NOWPayments):</strong> Configure{' '}
              <code className="text-gold-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">
                NOWPAYMENTS_API_KEY
              </code>{' '}
              and{' '}
              <code className="text-gold-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">
                NOWPAYMENTS_IPN_SECRET
              </code>{' '}
              in <code className="text-gold-400">.env.local</code>, and set your payout wallet in
              NOWPayments to your USDT BEP-20 or TRC-20 address with Fiat On-Ramp enabled.
            </p>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-white/70">
            <Info size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Binance Pay Merchant:</strong> Requires an approved merchant account.
              Configure via{' '}
              <code className="text-gold-400 bg-white/5 px-1.5 py-0.5 rounded text-xs">
                BINANCE_PAY_*
              </code>{' '}
              env vars when approved.
            </p>
          </div>
          <a
            href="https://developers.binance.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
          >
            View Binance Merchant &amp; API Documentation
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Fundraising Goal */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Target size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Fundraising Goal</h2>
              <p className="text-xs text-white/40">
                Configured target (editable in Content &rarr; goal_amount)
              </p>
            </div>
          </div>
          <p className="text-2xl font-bold text-gold-400">
            ${SITE_CONFIG.goal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Crypto Wallet Addresses */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/5 text-gold-400">
              <Wallet size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Crypto Wallet Addresses</h2>
              <p className="text-xs text-white/40">
                Display-only. Update addresses via <code className="text-gold-400">.env.local</code> / deployment environment variables.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/5 border border-white/5 rounded-lg overflow-hidden">
          {SUPPORTED_CRYPTOS.map((crypto) => {
            const key = `${crypto.symbol}-${crypto.network}`;
            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-black/20"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {crypto.name}{' '}
                    <span className="text-xs text-gold-400 font-mono">({crypto.symbol})</span>
                  </p>
                  <p className="text-xs text-white/40">{crypto.network}</p>
                </div>

                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-white/70 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg max-w-xs sm:max-w-sm truncate">
                    {crypto.wallet || 'Not configured in .env'}
                  </code>
                  {crypto.wallet && (
                    <button
                      onClick={() => handleCopy(key, crypto.wallet)}
                      className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      title="Copy address"
                    >
                      {copiedSymbol === key ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* US Bank Transfer Details (Grey / Lead Bank) */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">US Bank Account (Lead Bank via Grey)</h2>
              <p className="text-xs text-white/40">
                Receives FedNow, ACH, and Wire transfers for donations and Hire Me client payments.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-black/30 border border-white/5">
            <span className="text-white/40 block mb-1">Account Holder</span>
            <span className="font-semibold text-white">{BANK_TRANSFER_DETAILS.accountHolder}</span>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-white/5">
            <span className="text-white/40 block mb-1">Bank Name</span>
            <span className="font-semibold text-white">{BANK_TRANSFER_DETAILS.bankName}</span>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-white/5">
            <span className="text-white/40 block mb-1">Account Number</span>
            <code className="font-mono text-emerald-400">{BANK_TRANSFER_DETAILS.accountNumber}</code>
          </div>
          <div className="p-3 rounded-lg bg-black/30 border border-white/5">
            <span className="text-white/40 block mb-1">ACH Routing</span>
            <code className="font-mono text-emerald-400">{BANK_TRANSFER_DETAILS.routingNumber}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
