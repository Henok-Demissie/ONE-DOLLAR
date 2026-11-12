'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Clock, CheckCircle2, Share2, RefreshCw, CreditCard, Wallet, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { DONATION_AMOUNTS, BANK_TRANSFER_DETAILS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CryptoOption {
  id: string;
  currency: string;
  network: string;
  networkLabel: string;
  name: string;
  icon: string;
  color: string;
  badge?: string;
  fallbackWallet?: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: 'USDT_BEP20',
    currency: 'USDT',
    network: 'BEP20',
    networkLabel: 'BNB Smart Chain (BEP-20)',
    name: 'Tether USDT',
    icon: '₮',
    color: 'text-yellow-400',
    badge: 'Lowest Fee',
    fallbackWallet: process.env.NEXT_PUBLIC_USDT_BEP20_WALLET,
  },
  {
    id: 'USDT_TRC20',
    currency: 'USDT',
    network: 'TRC20',
    networkLabel: 'TRON (TRC-20)',
    name: 'Tether USDT',
    icon: '₮',
    color: 'text-emerald-400',
    fallbackWallet: process.env.NEXT_PUBLIC_USDT_TRC20_WALLET,
  },
  {
    id: 'BTC',
    currency: 'BTC',
    network: 'BTC',
    networkLabel: 'Bitcoin Network',
    name: 'Bitcoin',
    icon: '₿',
    color: 'text-orange-400',
    fallbackWallet: process.env.NEXT_PUBLIC_BTC_WALLET,
  },
  {
    id: 'ETH',
    currency: 'ETH',
    network: 'ERC20',
    networkLabel: 'Ethereum (ERC-20)',
    name: 'Ethereum',
    icon: 'Ξ',
    color: 'text-purple-400',
    fallbackWallet: process.env.NEXT_PUBLIC_ETH_WALLET,
  },
  {
    id: 'USDT_ERC20',
    currency: 'USDT',
    network: 'ERC20',
    networkLabel: 'Ethereum (ERC-20)',
    name: 'Tether USDT',
    icon: '₮',
    color: 'text-sky-400',
    fallbackWallet: process.env.NEXT_PUBLIC_USDT_ERC20_WALLET,
  },
  {
    id: 'BNB',
    currency: 'BNB',
    network: 'BSC',
    networkLabel: 'BNB Smart Chain',
    name: 'BNB',
    icon: '⬡',
    color: 'text-yellow-400',
    fallbackWallet: process.env.NEXT_PUBLIC_BNB_WALLET,
  },
];

const STEPS = ['Amount', 'Method', 'Info', 'Payment', 'Done'];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                i < current
                  ? 'bg-amber-500 border-amber-500 text-black'
                  : i === current
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-[#333] text-gray-600 bg-transparent'
              )}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs hidden md:block',
                i === current ? 'text-amber-400 font-medium' : 'text-gray-600'
              )}
            >
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                'h-0.5 w-6 md:w-12 transition-all duration-500',
                i < current ? 'bg-amber-500' : 'bg-[#333]'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CountdownTimer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const pct = (remaining / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'text-2xl font-mono font-bold',
          remaining < 300 ? 'text-red-400' : 'text-amber-400'
        )}
      >
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            remaining < 300 ? 'bg-red-500' : 'bg-amber-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Clock size={12} /> Time remaining to complete payment
      </p>
    </div>
  );
}

export function DonationSection() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'crypto' | 'bank' | 'card'>('crypto');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);
  const [cardOnRampEnabled, setCardOnRampEnabled] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(() => {
    return (
      CRYPTO_OPTIONS.find(
        (c) => Boolean(c.fallbackWallet && !c.fallbackWallet.startsWith('your_'))
      ) ?? null
    );
  });
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [txRef, setTxRef] = useState('');
  const [paymentExpired, setPaymentExpired] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  useEffect(() => {
    fetch('/api/donations/methods')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.cardOnRampEnabled === 'boolean') {
          setCardOnRampEnabled(d.cardOnRampEnabled);
        }
      })
      .catch(() => {});
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleCardCheckout = async () => {
    if (!finalAmount || finalAmount < 3) {
      toast.error('Card-to-crypto on-ramp requires a minimum of $3 USD.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/donations/card-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_usd: finalAmount,
          donor_name: isAnonymous ? 'Anonymous' : donorName.trim() || 'Anonymous',
          donor_email: donorEmail.trim() || '',
          donor_message: donorMessage.trim() || undefined,
          is_anonymous: isAnonymous,
        }),
      });
      const data = await res.json();
      if (res.ok && data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        toast.error(data.error || 'Card checkout is unavailable right now.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyBankDetail = async (label: string, value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedBankField(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedBankField(null), 2000);
  };

  const copyAddress = async () => {
    if (!walletAddress) return;
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitiateDonation = async () => {
    if (!finalAmount || finalAmount < 1) return;

    if (paymentMode === 'bank') {
      setLoading(true);
      try {
        const res = await fetch('/api/donations/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount_usd: finalAmount,
            currency: 'USD_ACH',
            network: 'FEDNOW_ACH_WIRE',
            donor_name: isAnonymous ? 'Anonymous' : donorName.trim() || 'Anonymous',
            donor_email: donorEmail.trim() || '',
            donor_message: donorMessage.trim() || undefined,
            is_anonymous: isAnonymous,
          }),
        });
        const data = await res.json();
        if (res.ok && data.session_token) {
          setSessionToken(data.session_token);
          setWalletAddress(BANK_TRANSFER_DETAILS.accountNumber);
          setTxRef(data.session_token.slice(0, 10).toUpperCase());
          setPaymentExpired(false);
          setStep(3);
        } else {
          toast.error(data.error || 'Failed to initiate bank donation session');
        }
      } catch {
        toast.error('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!selectedCrypto) return;
    setLoading(true);
    try {
      const res = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_usd: finalAmount,
          currency: selectedCrypto.currency,
          network: selectedCrypto.network,
          donor_name: isAnonymous ? 'Anonymous' : donorName.trim() || 'Anonymous',
          donor_email: donorEmail.trim() || '',
          donor_message: donorMessage.trim() || undefined,
          is_anonymous: isAnonymous,
        }),
      });
      const data = await res.json();
      if (res.ok && data.session_token) {
        setSessionToken(data.session_token);
        setWalletAddress(data.wallet_address || selectedCrypto.fallbackWallet || '');
        setTxRef(data.session_token.slice(0, 10).toUpperCase());
        setPaymentExpired(false);
        setStep(3);
      } else {
        toast.error(data.error || 'Failed to initiate donation');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollStatus = useCallback(async () => {
    if (!sessionToken) return false;
    try {
      const res = await fetch(`/api/donations/status?session_token=${encodeURIComponent(sessionToken)}`);
      const data = await res.json();
      if (data?.is_expired) {
        setPaymentExpired(true);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setPolling(false);
        return false;
      }
      if (data?.donation?.status === 'completed' || data?.session_status === 'submitted') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setPolling(false);
        setStep(4);
        return true;
      }
    } catch {
      // ignore transient poll error
    }
    return false;
  }, [sessionToken]);

  const handlePaymentConfirm = async () => {
    if (!sessionToken) return;
    setLoading(true);
    try {
      if (txHash.trim()) {
        const res = await fetch('/api/donations/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_token: sessionToken,
            tx_hash: txHash.trim(),
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('Transaction submitted for verification!');
          setTxRef(txHash.trim().slice(0, 14).toUpperCase());
          setStep(4);
          return;
        } else {
          toast.error(data.error || 'Invalid transaction hash. Please check and try again.');
          return;
        }
      }

      // If no tx hash entered yet, start polling status endpoint
      setPolling(true);
      const done = await pollStatus();
      if (!done) {
        toast.success('Checking payment status... Enter your Tx Hash for faster verification.');
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(pollStatus, 8000);
      }
    } catch {
      toast.error('Could not verify payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpire = useCallback(() => {
    setPaymentExpired(true);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
  }, []);

  const reset = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setStep(0);
    setAmount(1);
    setCustomAmount('');
    setSelectedCrypto(
      CRYPTO_OPTIONS.find(
        (c) => Boolean(c.fallbackWallet && !c.fallbackWallet.startsWith('your_'))
      ) ?? null
    );
    setDonorName('');
    setDonorEmail('');
    setDonorMessage('');
    setIsAnonymous(false);
    setSessionToken('');
    setWalletAddress('');
    setTxHash('');
    setPolling(false);
    setPaymentExpired(false);
  };

  return (
    <section id="donate" className="py-24 bg-[#080808]">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            SUPPORT THE{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              DREAM
            </span>
          </h2>
          <p className="text-gray-500">
            Every dollar fuels the vision. Choose your amount and pay with crypto.
          </p>
        </motion.div>

        <Card className="p-6 md:p-8">
          <StepIndicator current={step} total={STEPS.length} />

          <AnimatePresence mode="wait">
            {/* STEP 0: Amount Selection */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg font-bold text-white mb-5">Select Amount</h3>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {DONATION_AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setAmount(a);
                        setCustomAmount('');
                      }}
                      className={cn(
                        'py-3 rounded-xl font-bold text-sm border transition-all duration-200',
                        amount === a && !customAmount
                          ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                          : 'border-[#333] text-gray-400 hover:border-[#555] hover:text-white bg-[#0d0d0d]'
                      )}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <Input
                    label="Custom Amount (USD)"
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="Enter custom amount ($1 - $10,000)..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-6">
                  <p className="text-center text-3xl font-black text-amber-400">
                    ${Number.isFinite(finalAmount) ? finalAmount : 0}{' '}
                    <span className="text-base text-gray-500 font-normal">USD</span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!finalAmount || finalAmount < 1 || finalAmount > 10000}
                  onClick={() => setStep(1)}
                >
                  Continue →
                </Button>
              </motion.div>
            )}

            {/* STEP 1: Payment Method Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg font-bold text-white mb-2">Choose Payment Method</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Donating <span className="text-amber-400 font-semibold">${finalAmount}</span> USD
                </p>

                {/* Payment Mode Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0d0d0d] border border-[#222] mb-5">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('crypto')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all',
                      paymentMode === 'crypto'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    <Wallet size={14} />
                    Crypto
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('bank')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all',
                      paymentMode === 'bank'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    <Building2 size={14} />
                    US Bank (ACH)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all',
                      paymentMode === 'card'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    <CreditCard size={14} />
                    Card On-Ramp
                  </button>
                </div>

                {paymentMode === 'crypto' ? (
                  <>
                    <div className="grid gap-3 mb-5">
                      {CRYPTO_OPTIONS.map((crypto) => {
                        const isConfigured = Boolean(
                          crypto.fallbackWallet && !crypto.fallbackWallet.startsWith('your_')
                        );
                        return (
                          <button
                            key={crypto.id}
                            type="button"
                            disabled={!isConfigured}
                            onClick={() => isConfigured && setSelectedCrypto(crypto)}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
                              !isConfigured
                                ? 'border-[#1a1a1a] bg-[#0a0a0a] opacity-50 cursor-not-allowed'
                                : selectedCrypto?.id === crypto.id
                                ? 'border-amber-500 bg-amber-500/10'
                                : 'border-[#222] bg-[#0d0d0d] hover:border-[#444]'
                            )}
                          >
                            <span className={cn('text-2xl font-bold w-8 text-center', crypto.color)}>
                              {crypto.icon}
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white text-sm">
                                  {crypto.name} ({crypto.currency})
                                </p>
                                {crypto.badge && isConfigured && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    {crypto.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{crypto.networkLabel}</p>
                            </div>
                            {!isConfigured ? (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10">
                                Not Active
                              </span>
                            ) : selectedCrypto?.id === crypto.id ? (
                              <Check size={16} className="text-amber-400 shrink-0" />
                            ) : (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Active
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20 mb-5">
                      <p className="text-xs text-sky-400 leading-relaxed">
                        <strong>Tip:</strong> BNB Smart Chain (BEP-20) has the lowest network fees
                        (~$0.01–$0.20) compared to TRON (TRC-20). Direct Binance Pay checkout is
                        reserved for approved merchant accounts.
                      </p>
                    </div>
                  </>
                ) : paymentMode === 'bank' ? (
                  <div className="space-y-4 mb-5">
                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Building2 size={20} className="text-emerald-400" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Direct US Bank Transfer (Lead Bank via Grey)
                            </p>
                            <p className="text-xs text-gray-500">
                              Instant 24/7 via FedNow, or 1 business day via ACH
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/25">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Supporters with US bank accounts or fintech apps (Chase, Wells Fargo, BoA, Wise, Revolut, etc.) can send transfers directly without blockchain gas fees.
                      </p>

                      <div className="divide-y divide-[#222] border border-[#222] rounded-lg bg-[#0d0d0d] overflow-hidden text-xs">
                        <div className="flex items-center justify-between p-2.5">
                          <div>
                            <span className="text-gray-500 block text-[11px]">Account Holder</span>
                            <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.accountHolder}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Account Holder', BANK_TRANSFER_DETAILS.accountHolder)}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            {copiedBankField === 'Account Holder' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2.5">
                          <div>
                            <span className="text-gray-500 block text-[11px]">Bank Name</span>
                            <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.bankName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Bank Name', BANK_TRANSFER_DETAILS.bankName)}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            {copiedBankField === 'Bank Name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2.5">
                          <div>
                            <span className="text-gray-500 block text-[11px]">Account Number (Checking)</span>
                            <code className="text-emerald-400 font-mono font-semibold">{BANK_TRANSFER_DETAILS.accountNumber}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Account Number', BANK_TRANSFER_DETAILS.accountNumber)}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            {copiedBankField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2.5">
                          <div>
                            <span className="text-gray-500 block text-[11px]">ACH Routing Number</span>
                            <code className="text-emerald-400 font-mono font-semibold">{BANK_TRANSFER_DETAILS.routingNumber}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Routing Number', BANK_TRANSFER_DETAILS.routingNumber)}
                            className="p-1.5 text-gray-400 hover:text-white"
                          >
                            {copiedBankField === 'Routing Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <p className="text-[11px] text-amber-300 leading-relaxed">
                          Supported methods: <strong>FedNow (instant 24/7)</strong>, <strong>ACH Transfer</strong>, or <strong>Domestic Wire</strong>. Click <em>Continue</em> to enter your name and message.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-5">
                    <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <CreditCard size={20} className="text-amber-400" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Visa / Mastercard → USDT On-Ramp
                            </p>
                            <p className="text-xs text-gray-500">
                              Powered by NOWPayments hosted checkout
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'text-[11px] font-medium px-2.5 py-0.5 rounded-full border',
                            cardOnRampEnabled
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'
                          )}
                        >
                          {cardOnRampEnabled ? 'Active' : 'API Key Needed'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Pay with your debit or credit card without holding crypto. The gateway
                        converts your payment and settles USDT directly to the verified Binance
                        wallet.
                      </p>
                      {finalAmount < 3 && (
                        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                          <p className="text-xs text-yellow-300 leading-relaxed">
                            ⚠ Card-to-crypto on-ramp partners enforce a <strong>$3 USD minimum</strong>{' '}
                            plus card processing fees. Go back and pick <strong>$5+</strong> for card
                            checkout, or use <strong>Crypto Wallet (BEP-20)</strong> for $1.
                          </p>
                        </div>
                      )}
                      {!cardOnRampEnabled && (
                        <div className="p-3 rounded-lg bg-sky-500/5 border border-sky-500/20">
                          <p className="text-xs text-sky-400 leading-relaxed">
                            Admin setup required: Add <code>NOWPAYMENTS_API_KEY</code> and{' '}
                            <code>NOWPAYMENTS_IPN_SECRET</code> to <code>.env.local</code> to
                            activate live card checkout.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="ghost" size="md" className="flex-1" onClick={() => setStep(0)}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={
                      paymentMode === 'crypto'
                        ? !selectedCrypto
                        : paymentMode === 'bank'
                        ? false
                        : finalAmount < 3 || !cardOnRampEnabled
                    }
                    onClick={() => setStep(2)}
                  >
                    Continue →
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Donor Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg font-bold text-white mb-5">Donor Info (Optional)</h3>
                <div className="space-y-4 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#222] bg-[#0d0d0d]">
                    <div>
                      <span className="text-sm text-gray-300 font-medium">Donate anonymously</span>
                      <p className="text-xs text-gray-600">Hide your name from the Supporters Wall</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      aria-label="Toggle anonymous donation"
                      className={cn(
                        'w-11 h-6 rounded-full transition-all duration-300 relative',
                        isAnonymous ? 'bg-amber-500' : 'bg-[#333]'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300',
                          isAnonymous ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>
                  {!isAnonymous && (
                    <Input
                      label="Your Name"
                      placeholder="How should we credit you?"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  )}
                  <Input
                    label="Email (optional)"
                    type="email"
                    placeholder="your@email.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    helperText="Optional — we'll send a confirmation receipt."
                  />
                  <Textarea
                    label="Message of Support (optional)"
                    placeholder="Leave a message of encouragement..."
                    rows={3}
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" size="md" className="flex-1" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    loading={loading}
                    onClick={paymentMode === 'card' ? handleCardCheckout : handleInitiateDonation}
                  >
                    {paymentMode === 'card' ? 'PAY WITH CARD →' : 'DONATE NOW'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg font-bold text-white mb-5">Complete Payment</h3>
                {paymentExpired ? (
                  <div className="text-center py-8">
                    <p className="text-red-400 font-semibold mb-4">
                      Payment session expired. Please start a new donation.
                    </p>
                    <Button variant="primary" size="md" onClick={reset}>
                      Start Over
                    </Button>
                  </div>
                ) : (
                  <>
                    {paymentMode === 'bank' ? (
                      <div className="space-y-4 mb-5">
                        <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Building2 size={18} className="text-emerald-400" />
                            <h4 className="text-sm font-bold text-white">Transfer to US Bank Account (Lead Bank via Grey)</h4>
                          </div>

                          <div className="divide-y divide-[#222] border border-[#222] rounded-lg bg-[#0d0d0d] overflow-hidden text-xs">
                            <div className="flex items-center justify-between p-2.5">
                              <div>
                                <span className="text-gray-500 block text-[11px]">Account Holder</span>
                                <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.accountHolder}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Account Holder', BANK_TRANSFER_DETAILS.accountHolder)}
                                className="p-1.5 text-gray-400 hover:text-white"
                              >
                                {copiedBankField === 'Account Holder' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-2.5">
                              <div>
                                <span className="text-gray-500 block text-[11px]">Bank Name</span>
                                <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.bankName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Bank Name', BANK_TRANSFER_DETAILS.bankName)}
                                className="p-1.5 text-gray-400 hover:text-white"
                              >
                                {copiedBankField === 'Bank Name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-2.5">
                              <div>
                                <span className="text-gray-500 block text-[11px]">Account Number (Checking)</span>
                                <code className="text-emerald-400 font-mono font-semibold">{BANK_TRANSFER_DETAILS.accountNumber}</code>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Account Number', BANK_TRANSFER_DETAILS.accountNumber)}
                                className="p-1.5 text-gray-400 hover:text-white"
                              >
                                {copiedBankField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-2.5">
                              <div>
                                <span className="text-gray-500 block text-[11px]">ACH Routing Number</span>
                                <code className="text-emerald-400 font-mono font-semibold">{BANK_TRANSFER_DETAILS.routingNumber}</code>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Routing Number', BANK_TRANSFER_DETAILS.routingNumber)}
                                className="p-1.5 text-gray-400 hover:text-white"
                              >
                                {copiedBankField === 'Routing Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>

                          <div className="w-full">
                            <Input
                              label="Transfer Reference / Bank Transaction ID"
                              placeholder="Paste your bank transfer confirmation / reference number..."
                              value={txHash}
                              onChange={(e) => setTxHash(e.target.value)}
                              helperText="Enter your bank reference so we can match and verify your contribution."
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 mb-5">
                        <div className="p-3 bg-white rounded-xl">
                          <QRCodeSVG value={walletAddress || 'wallet-pending'} size={160} />
                        </div>
                        <div className="w-full">
                          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">
                            {selectedCrypto?.name} Wallet Address ({selectedCrypto?.networkLabel})
                          </p>
                          <div className="flex items-center gap-2 p-3 rounded-lg border border-[#333] bg-[#0d0d0d]">
                            <code className="flex-1 text-xs text-emerald-400 break-all">
                              {walletAddress || 'Wallet address unavailable'}
                            </code>
                            <button
                              type="button"
                              onClick={copyAddress}
                              className="shrink-0 p-1.5 rounded text-gray-400 hover:text-amber-400 transition-colors"
                              aria-label="Copy wallet address"
                            >
                              {copied ? (
                                <Check size={14} className="text-emerald-400" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-3 text-center">
                          <div className="p-3 rounded-lg border border-[#222] bg-[#0d0d0d]">
                            <p className="text-xs text-gray-500">Amount (USD)</p>
                            <p className="text-lg font-bold text-amber-400">${finalAmount}</p>
                          </div>
                          <div className="p-3 rounded-lg border border-[#222] bg-[#0d0d0d]">
                            <p className="text-xs text-gray-500">Network</p>
                            <p className="text-sm font-semibold text-white">
                              {selectedCrypto?.networkLabel}
                            </p>
                          </div>
                        </div>
                        <div className="w-full p-4 rounded-xl border border-[#222] bg-[#0d0d0d]">
                          <CountdownTimer seconds={1800} onExpire={handleExpire} />
                        </div>
                        <div className="w-full">
                          <Input
                            label="Transaction Hash (TxID)"
                            placeholder="Paste your transaction hash after sending..."
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            helperText="Submitting your TxID speeds up verification."
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 mb-5">
                      <p className="text-xs text-yellow-400 text-center leading-relaxed">
                        {paymentMode === 'bank' ? (
                          <>
                            ⚠ Send <strong>${finalAmount} USD</strong> via FedNow, ACH, or Wire to the Lead Bank account above. Donations are voluntary and non-refundable.
                          </>
                        ) : (
                          <>
                            ⚠ Send <strong>ONLY {selectedCrypto?.currency}</strong> on the{' '}
                            <strong>{selectedCrypto?.networkLabel}</strong> network (minimum &gt; 0.01 USDT).
                            Sending any other asset or network may result in permanent loss of funds.
                            Donations are voluntary and non-refundable.
                          </>
                        )}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={loading}
                      onClick={handlePaymentConfirm}
                    >
                      {polling ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" /> Checking Payment Status...
                        </>
                      ) : (
                        "I've Completed the Payment"
                      )}
                    </Button>
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 4: Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 size={40} className="text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-2">Thank You! 🙏</h3>
                <p className="text-gray-400 mb-6">
                  Your donation of{' '}
                  <span className="text-amber-400 font-bold">${finalAmount}</span> via{' '}
                  <span className="text-amber-400">
                    {selectedCrypto?.currency} ({selectedCrypto?.network})
                  </span>{' '}
                  has been submitted for verification.
                </p>
                <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d] mb-6 text-left space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Reference ID</p>
                    <p className="font-mono text-sm text-emerald-400">{txRef}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-xs text-amber-400 font-semibold">
                      Submitted — Pending Blockchain Confirmation
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center mb-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          `I just supported One Dollar Project with $${finalAmount}! ONE DOLLAR. ONE DREAM.`
                        )}`,
                        '_blank'
                      )
                    }
                  >
                    <Share2 size={14} /> Share on X
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied!');
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={reset}>
                  Make Another Donation
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}
