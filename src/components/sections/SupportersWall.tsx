'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface PublicSupporter {
  id: string;
  donor_name: string | null;
  donor_message?: string | null;
  amount_usd: number;
  currency?: string;
  created_at: string;
}

const FALLBACK_SUPPORTERS: PublicSupporter[] = [
  {
    id: 'sample-1',
    donor_name: 'Alex Rivera',
    donor_message: 'Keep pushing forward! Every $1 counts toward something truly extraordinary.',
    amount_usd: 5,
    currency: 'USDT',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-2',
    donor_name: 'Maya Chen',
    donor_message: 'Love the transparency, design quality, and ambition. Rooting for you!',
    amount_usd: 10,
    currency: 'ETH',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-3',
    donor_name: 'Anonymous',
    donor_message: 'One dollar for a million-dollar dream. Let’s make it happen.',
    amount_usd: 1,
    currency: 'BTC',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
];

export function SupportersWall() {
  const [supporters, setSupporters] = useState<PublicSupporter[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const perPage = 9;

  const fetchSupporters = useCallback(async (pageNum: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await fetch(`/api/public/supporters?page=${pageNum}&per_page=${perPage}`);
      if (!res.ok) throw new Error('Failed to load supporters');
      const data = await res.json();

      const rows: PublicSupporter[] = data.supporters ?? [];
      setSupporters((prev) => (append ? [...prev, ...rows] : rows));
      setTotal(data.total ?? rows.length);
    } catch {
      if (pageNum === 1) {
        setSupporters([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchSupporters(1, false);
  }, [fetchSupporters]);

  const hasMore = supporters.length < total;

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSupporters(nextPage, true);
  };

  return (
    <section id="supporters" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#0DCB3D]/30 bg-[#0DCB3D]/10 text-[#0DCB3D] mb-4 backdrop-blur-md shadow-[0_0_12px_rgba(13,203,61,0.25)]">
            <Heart size={12} className="fill-[#0DCB3D] text-[#0DCB3D]" />
            <span>Verified Community Ledger</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-['Outfit']">
            Supporters{' '}
            <span className="bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_15px_rgba(13,203,61,0.4)]">
              wall
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Grateful for every verified contributor helping prove that small, collective support compounds into extraordinary milestones.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="astryx-card p-6 animate-pulse h-36">
                <div className="h-4 w-1/3 bg-white/10 rounded mb-3" />
                <div className="h-3 w-full bg-white/5 rounded mb-2" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : supporters.length === 0 ? (
          <div className="astryx-card p-10 text-center max-w-md mx-auto space-y-3 border-white/[0.08]">
            <div className="w-12 h-12 rounded-2xl bg-[#0DCB3D]/15 border border-[#0DCB3D]/30 flex items-center justify-center mx-auto text-[#0DCB3D] shadow-[0_0_20px_rgba(13,203,61,0.3)]">
              <Heart size={22} className="fill-[#0DCB3D]" />
            </div>
            <h3 className="text-lg font-['Outfit'] font-bold text-white">Be the First Supporter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The journey starts here. Support with $1 to permanently place your name and message on the community wall!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {supporters.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.05, duration: 0.4 }}
                >
                  <div className="astryx-card p-6 h-full flex flex-col justify-between gap-4 group hover:border-[#0DCB3D]/50 transition-all duration-300">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0DCB3D]/15 border border-[#0DCB3D]/40 flex items-center justify-center text-[#0DCB3D] font-['Outfit'] font-bold text-sm shadow-[0_0_12px_rgba(13,203,61,0.25)]">
                          {(s.donor_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-['Outfit'] font-bold text-white text-sm group-hover:text-[#0DCB3D] transition-colors">
                            {s.donor_name || 'Anonymous'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{formatDate(s.created_at)}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#0DCB3D]/15 border border-[#0DCB3D]/30 text-[#0DCB3D] text-xs font-mono font-bold tracking-tight shadow-[0_0_8px_rgba(13,203,61,0.2)]">
                        ${Number(s.amount_usd).toLocaleString()}
                      </div>
                    </div>

                    {s.donor_message ? (
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed flex items-start gap-2 bg-[#070a10]/50 p-3 rounded-xl border border-white/[0.04]">
                        <MessageCircle size={14} className="text-slate-500 shrink-0 mt-0.5" />
                        <span className="italic">&ldquo;{s.donor_message}&rdquo;</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 italic flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        <span>Fueled the dream</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <Button variant="secondary" loading={loadingMore} onClick={handleLoadMore}>
                  Load More Supporters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
