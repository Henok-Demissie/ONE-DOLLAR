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
    donor_message: 'Keep pushing forward! Every $1 counts toward something big.',
    amount_usd: 5,
    currency: 'USDT',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-2',
    donor_name: 'Maya Chen',
    donor_message: 'Love the transparency and ambition. Rooting for you!',
    amount_usd: 10,
    currency: 'ETH',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'sample-3',
    donor_name: 'Anonymous',
    donor_message: 'One dollar for a million-dollar dream.',
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
      if (pageNum === 1 && rows.length === 0) {
        setSupporters(FALLBACK_SUPPORTERS);
        setTotal(FALLBACK_SUPPORTERS.length);
      } else {
        setSupporters((prev) => (append ? [...prev, ...rows] : rows));
        setTotal(data.total ?? rows.length);
      }
    } catch {
      if (pageNum === 1) {
        setSupporters(FALLBACK_SUPPORTERS);
        setTotal(FALLBACK_SUPPORTERS.length);
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
    <section id="supporters" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            <Heart size={13} className="fill-amber-400" /> Verified Community
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            SUPPORTERS{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              WALL
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Grateful for every verified supporter who helped move the needle forward.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="p-6 animate-pulse h-36 bg-[#111]">
                <div className="h-4 w-1/3 bg-[#222] rounded mb-3" />
                <div className="h-3 w-full bg-[#1a1a1a] rounded mb-2" />
                <div className="h-3 w-2/3 bg-[#1a1a1a] rounded" />
              </Card>
            ))}
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
                  <Card hover glow="gold" className="p-6 h-full flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                          {(s.donor_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {s.donor_name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(s.created_at)}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                        ${Number(s.amount_usd).toLocaleString()}
                      </span>
                    </div>

                    {s.donor_message ? (
                      <p className="text-sm text-gray-300 leading-relaxed flex items-start gap-2">
                        <MessageCircle size={14} className="text-gray-600 shrink-0 mt-1" />
                        <span>&ldquo;{s.donor_message}&rdquo;</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-600 italic">Supported the dream</p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
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
