'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Clock, CheckCircle2, Share2, RefreshCw, CreditCard, Wallet, Building2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
    color: 'text-amber-400',
    badge: 'Lowest Fee (~$0.15)',
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
    color: 'text-sky-400',
    fallbackWallet: process.env.NEXT_PUBLIC_ETH_WALLET,
  },
  {
    id: 'USDT_ERC20',
    currency: 'USDT',
    network: 'ERC20',
    networkLabel: 'Ethereum (ERC-20)',
    name: 'Tether USDT',
    icon: '₮',
    color: 'text-teal-400',
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
    <div className="flex items-center gap-2 justify-center mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 font-mono',
                i < current
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 border-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : i === current
                  ? 'border-amber-400 text-amber-300 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/20'
                  : 'border-white/[0.08] text-slate-500 bg-white/[0.02]'
              )}
            >
              {i < current ? <Check size={14} className="stroke-[3]" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-[11px] font-semibold tracking-wider uppercase hidden sm:block',
                i === current ? 'text-amber-400' : 'text-slate-500'
              )}
            >
              {label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className={cn(
                'h-[2px] w-5 sm:w-10 transition-all duration-500 rounded-full',
                i < current ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-white/[0.08]'
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
          'text-2xl font-mono font-bold tracking-wider',
          remaining < 300 ? 'text-red-400' : 'text-amber-400'
        )}
      >
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </div>
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            remaining < 300
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
        <Clock size={12} className="text-amber-400" /> Time remaining to lock live rate
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
    <section id="donate" className="py-24 relative overflow-hidden">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-amber-400/25 bg-amber-400/5 text-amber-400 mb-4 backdrop-blur-md">
            <Sparkles size={12} className="text-amber-400" />
            <span>Multi-Rail Contribution Hub</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-['Outfit'] font-extrabold text-white mb-3 tracking-tight">
            SUPPORT THE{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
              DREAM
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-normal max-w-lg mx-auto">
            Every single dollar directly powers the platform and open innovation. Choose your rail: Binance Pay, US Bank FedNow/ACH, or Card On-Ramp.
          </p>
        </motion.div>

        <Card className="p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
          <StepIndicator current={step} total={STEPS.length} />

          <AnimatePresence mode="wait">
            {/* STEP 0: Amount Selection */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-['Outfit'] font-bold text-white">Select Amount</h3>
                  <span className="text-xs text-slate-400 font-medium">USD Equivalent</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 mb-5">
                  {DONATION_AMOUNTS.map((a) => {
                    const isSelected = amount === a && !customAmount;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          setAmount(a);
                          setCustomAmount('');
                        }}
                        className={cn(
                          'py-3.5 rounded-xl font-mono font-bold text-sm border transition-all duration-200 cursor-pointer',
                          isSelected
                            ? 'border-amber-400 bg-gradient-to-b from-amber-400/20 to-amber-500/10 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.2)] ring-1 ring-amber-400/40'
                            : 'border-white/[0.08] text-slate-300 hover:border-white/20 hover:text-white bg-white/[0.02] hover:bg-white/[0.04]'
                        )}
                      >
                        ${a}
                      </button>
                    );
                  })}
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

                {/* Amount preview badge card */}
                <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Total Commitment</span>
                    <span className="text-xs text-amber-400/80">Voluntary &amp; Non-Refundable</span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-['Outfit'] font-extrabold text-amber-400 font-mono">
                      ${Number.isFinite(finalAmount) ? finalAmount : 0}{' '}
                      <span className="text-xs text-slate-400 font-sans font-normal uppercase">USD</span>
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={!finalAmount || finalAmount < 1 || finalAmount > 10000}
                  onClick={() => setStep(1)}
                >
                  <span>Select Payment Rail</span>
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            )}

            {/* STEP 1: Payment Method Selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-['Outfit'] font-bold text-white">Choose Payment Rail</h3>
                  <div className="astryx-pill text-amber-400 border-amber-400/30 font-mono">
                    ${finalAmount} USD
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  Select your preferred settlement rail below.
                </p>

                {/* Segmented Rail Picker */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#070a10] border border-white/[0.08] mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('crypto')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                      paymentMode === 'crypto'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <Wallet size={14} />
                    <span>Crypto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('bank')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                      paymentMode === 'bank'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <Building2 size={14} />
                    <span>US Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('card')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
                      paymentMode === 'card'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    )}
                  >
                    <CreditCard size={14} />
                    <span>Card On-Ramp</span>
                  </button>
                </div>

                {paymentMode === 'crypto' ? (
                  <>
                    <div className="grid gap-2.5 mb-5">
                      {CRYPTO_OPTIONS.map((crypto) => {
                        const isConfigured = Boolean(
                          crypto.fallbackWallet && !crypto.fallbackWallet.startsWith('your_')
                        );
                        const isSelected = selectedCrypto?.id === crypto.id;
                        return (
                          <div
                            key={crypto.id}
                            onClick={() => isConfigured && setSelectedCrypto(crypto)}
                            className={cn(
                              'flex items-center gap-3.5 p-3.5 rounded-xl border transition-all duration-200',
                              !isConfigured
                                ? 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-not-allowed'
                                : isSelected
                                ? 'border-amber-400/80 bg-amber-400/[0.06] shadow-[0_0_20px_rgba(245,158,11,0.12)] cursor-pointer ring-1 ring-amber-400/30'
                                : 'border-white/[0.08] bg-[#090d15]/60 hover:border-white/20 hover:bg-white/[0.03] cursor-pointer'
                            )}
                          >
                            <span className={cn('text-2xl font-bold w-8 text-center', crypto.color)}>
                              {crypto.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white text-sm tracking-tight truncate">
                                  {crypto.name} ({crypto.currency})
                                </p>
                                {crypto.badge && isConfigured && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 shrink-0">
                                    {crypto.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 truncate">{crypto.networkLabel}</p>
                            </div>
                            {!isConfigured ? (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-500 border border-white/[0.06] shrink-0">
                                Offline
                              </span>
                            ) : isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-black shrink-0">
                                <Check size={12} className="stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-3.5 rounded-xl bg-sky-500/[0.05] border border-sky-500/20 mb-5">
                      <p className="text-xs text-sky-300 leading-relaxed">
                        <strong className="text-sky-200">Recommendation:</strong> BNB Smart Chain (BEP-20) settled to the verified Binance wallet features the lowest gas fees (~$0.15) and instant 3-second block confirmation.
                      </p>
                    </div>
                  </>
                ) : paymentMode === 'bank' ? (
                  <div className="space-y-4 mb-5">
                    <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Direct US Bank Transfer (Lead Bank via Grey)
                            </p>
                            <p className="text-xs text-slate-400">
                              Instant 24/7 via FedNow, or 1 business day via ACH
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Supporters with US bank accounts or fintech apps (Chase, Wells Fargo, BoA, Wise, Revolut) can send transfers directly with zero blockchain network fees.
                      </p>

                      <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-xl bg-[#070a10]/80 overflow-hidden text-xs">
                        <div className="flex items-center justify-between p-3">
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Account Holder</span>
                            <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.accountHolder}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Account Holder', BANK_TRANSFER_DETAILS.accountHolder)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            {copiedBankField === 'Account Holder' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3">
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Bank Name</span>
                            <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.bankName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Bank Name', BANK_TRANSFER_DETAILS.bankName)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            {copiedBankField === 'Bank Name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3">
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Account Number (Checking)</span>
                            <code className="text-emerald-400 font-mono font-bold text-sm">{BANK_TRANSFER_DETAILS.accountNumber}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Account Number', BANK_TRANSFER_DETAILS.accountNumber)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            {copiedBankField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3">
                          <div>
                            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">ACH Routing Number</span>
                            <code className="text-emerald-400 font-mono font-bold text-sm">{BANK_TRANSFER_DETAILS.routingNumber}</code>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyBankDetail('Routing Number', BANK_TRANSFER_DETAILS.routingNumber)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          >
                            {copiedBankField === 'Routing Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/20">
                        <p className="text-[11px] text-amber-300 leading-relaxed">
                          Supported rails: <strong>FedNow (instant 24/7)</strong>, <strong>ACH Transfer</strong>, or <strong>Domestic Wire</strong>. Click <em>Continue</em> to provide your name and message.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-5">
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-[#090d15]/80 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <CreditCard size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Visa / Mastercard → USDT On-Ramp
                            </p>
                            <p className="text-xs text-slate-400">
                              Powered by NOWPayments hosted checkout
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            'text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                            cardOnRampEnabled
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                          )}
                        >
                          {cardOnRampEnabled ? 'Active' : 'API Key Needed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Pay with debit or credit card without holding crypto. The gateway converts your payment and settles USDT directly to the verified Binance wallet.
                      </p>
                      {finalAmount < 3 && (
                        <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                          <p className="text-xs text-yellow-300 leading-relaxed">
                            ⚠ Card-to-crypto on-ramp partners enforce a <strong>$3 USD minimum</strong> plus card processing fees. Pick <strong>$5+</strong> for card checkout, or use <strong>Crypto Wallet (BEP-20)</strong> for $1.
                          </p>
                        </div>
                      )}
                      {!cardOnRampEnabled && (
                        <div className="p-3 rounded-xl bg-sky-500/[0.05] border border-sky-500/20">
                          <p className="text-xs text-sky-300 leading-relaxed">
                            Admin setup required: Add <code>NOWPAYMENTS_API_KEY</code> and{' '}
                            <code>NOWPAYMENTS_IPN_SECRET</code> to <code>.env.local</code> to activate live card checkout.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="ghost" size="md" className="flex-1 justify-center" onClick={() => setStep(0)}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 justify-center"
                    disabled={
                      paymentMode === 'crypto'
                        ? !selectedCrypto
                        : paymentMode === 'bank'
                        ? false
                        : finalAmount < 3 || !cardOnRampEnabled
                    }
                    onClick={() => setStep(2)}
                  >
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Donor Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-['Outfit'] font-bold text-white">Donor Info (Optional)</h3>
                  <div className="astryx-pill text-amber-400 font-mono text-[11px]">
                    ${finalAmount} via {paymentMode === 'crypto' ? selectedCrypto?.currency : paymentMode === 'bank' ? 'US Bank' : 'Card'}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-[#090d15]/80">
                    <div>
                      <span className="text-sm text-slate-200 font-medium">Donate anonymously</span>
                      <p className="text-xs text-slate-400">Hide your name from the public Supporters Wall</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      aria-label="Toggle anonymous donation"
                      className={cn(
                        'w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer',
                        isAnonymous ? 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/[0.1]'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300',
                          isAnonymous ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>

                  {!isAnonymous && (
                    <Input
                      label="Your Name"
                      placeholder="How should we credit you on the wall?"
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
                    helperText="Optional — receipt and verification notifications only."
                  />

                  <Textarea
                    label="Message of Support (optional)"
                    placeholder="Leave a message of encouragement for the community..."
                    rows={3}
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" size="md" className="flex-1 justify-center" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 justify-center"
                    loading={loading}
                    onClick={paymentMode === 'card' ? handleCardCheckout : handleInitiateDonation}
                  >
                    {paymentMode === 'card' ? 'Proceed to Card Checkout →' : 'Proceed to Payment →'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-['Outfit'] font-bold text-white">Complete Transfer</h3>
                  <div className="astryx-pill text-emerald-400 border-emerald-400/30 text-[11px]">
                    <ShieldCheck size={12} />
                    <span>Session Locked</span>
                  </div>
                </div>

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
                        <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] space-y-3.5">
                          <div className="flex items-center gap-2">
                            <Building2 size={18} className="text-emerald-400" />
                            <h4 className="text-sm font-bold text-white">Transfer to US Bank (Lead Bank via Grey)</h4>
                          </div>

                          <div className="divide-y divide-white/[0.06] border border-white/[0.08] rounded-xl bg-[#070a10]/80 overflow-hidden text-xs">
                            <div className="flex items-center justify-between p-3">
                              <div>
                                <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Account Holder</span>
                                <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.accountHolder}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Account Holder', BANK_TRANSFER_DETAILS.accountHolder)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
                              >
                                {copiedBankField === 'Account Holder' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-3">
                              <div>
                                <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Bank Name</span>
                                <span className="text-white font-medium">{BANK_TRANSFER_DETAILS.bankName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Bank Name', BANK_TRANSFER_DETAILS.bankName)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
                              >
                                {copiedBankField === 'Bank Name' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-3">
                              <div>
                                <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Account Number (Checking)</span>
                                <code className="text-emerald-400 font-mono font-bold text-sm">{BANK_TRANSFER_DETAILS.accountNumber}</code>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Account Number', BANK_TRANSFER_DETAILS.accountNumber)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
                              >
                                {copiedBankField === 'Account Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-3">
                              <div>
                                <span className="text-slate-400 block text-[11px] uppercase tracking-wider">ACH Routing Number</span>
                                <code className="text-emerald-400 font-mono font-bold text-sm">{BANK_TRANSFER_DETAILS.routingNumber}</code>
                              </div>
                              <button
                                type="button"
                                onClick={() => copyBankDetail('Routing Number', BANK_TRANSFER_DETAILS.routingNumber)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
                              >
                                {copiedBankField === 'Routing Number' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>

                          <div className="w-full">
                            <Input
                              label="Transfer Reference / Bank Transaction ID"
                              placeholder="Paste bank transfer reference or FedNow transaction ID..."
                              value={txHash}
                              onChange={(e) => setTxHash(e.target.value)}
                              helperText="Enter your bank confirmation reference so our admin system can match your deposit."
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 mb-5">
                        {/* Astryx QR frame */}
                        <div className="p-3.5 bg-white rounded-2xl shadow-xl border border-white/20">
                          <QRCodeSVG value={walletAddress || 'wallet-pending'} size={168} />
                        </div>

                        <div className="w-full">
                          <p className="text-xs text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">
                            {selectedCrypto?.name} Deposit Address ({selectedCrypto?.networkLabel})
                          </p>
                          <div className="flex items-center gap-2 p-3.5 rounded-xl border border-white/[0.08] bg-[#070a10]">
                            <code className="flex-1 text-xs text-amber-300 font-mono break-all select-all">
                              {walletAddress || 'Wallet address unavailable'}
                            </code>
                            <button
                              type="button"
                              onClick={copyAddress}
                              className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
                              aria-label="Copy wallet address"
                            >
                              {copied ? (
                                <Check size={16} className="text-emerald-400 stroke-[3]" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3 text-center">
                          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#070a10]">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Amount (USD)</p>
                            <p className="text-xl font-['Outfit'] font-bold text-amber-400 font-mono mt-0.5">${finalAmount}</p>
                          </div>
                          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#070a10]">
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Target Network</p>
                            <p className="text-xs font-semibold text-white mt-1 truncate">
                              {selectedCrypto?.networkLabel}
                            </p>
                          </div>
                        </div>

                        <div className="w-full p-4 rounded-xl border border-white/[0.08] bg-[#070a10]">
                          <CountdownTimer seconds={1800} onExpire={handleExpire} />
                        </div>

                        <div className="w-full">
                          <Input
                            label="Transaction Hash (TxID)"
                            placeholder="Paste your transaction hash (0x... or TxID) after sending..."
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            helperText="Submitting your TxID triggers instant automated verification."
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 mb-5">
                      <p className="text-xs text-amber-300 text-center leading-relaxed">
                        {paymentMode === 'bank' ? (
                          <>
                            ⚠ Send <strong>${finalAmount} USD</strong> via FedNow, ACH, or Wire to the Lead Bank account above. Donations are voluntary and non-refundable.
                          </>
                        ) : (
                          <>
                            ⚠ Send <strong>ONLY {selectedCrypto?.currency}</strong> on the{' '}
                            <strong>{selectedCrypto?.networkLabel}</strong> network (minimum &gt; 0.01 USDT).
                            Sending any other asset or network may result in loss of funds.
                          </>
                        )}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                      loading={loading}
                      onClick={handlePaymentConfirm}
                    >
                      {polling ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Checking Payment Status...</span>
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 size={40} className="text-emerald-400 stroke-[2.5]" />
                </motion.div>

                <h3 className="text-3xl font-['Outfit'] font-extrabold text-white mb-2">Thank You! 🙏</h3>
                <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                  Your contribution of{' '}
                  <span className="text-amber-400 font-bold font-mono">${finalAmount}</span> has been received and submitted to the ledger for live verification.
                </p>

                <div className="p-4 rounded-xl border border-white/[0.08] bg-[#070a10] mb-6 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Reference ID</span>
                    <span className="font-mono text-xs text-amber-300 font-bold">{txRef}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Status</span>
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Submitted — Awaiting Confirmation
                    </span>
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
