'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Share2, ArrowLeft, Copy, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '1';
  const currency = searchParams.get('currency') || 'USDT';
  const reference = searchParams.get('ref') || 'ODP-VERIFIED';
  const dateStr = searchParams.get('date') || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://onedollarproject.com';
  const shareText = `I just supported One Dollar Project with $${amount}! ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-2xl py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-8 md:p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            className="w-20 h-20 rounded-full bg-[#0DCB3D]/15 border-2 border-[#0DCB3D] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(13,203,61,0.35)]"
          >
            <CheckCircle2 size={40} className="text-[#0DCB3D]" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent mb-4">
            THANK YOU FOR BEING PART OF THE DREAM!
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Your generosity moves this mission forward. Every single dollar proves what&apos;s
            possible when people believe in building something extraordinary.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d]">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
              <p className="text-xl font-black text-[#0DCB3D] mt-1">${amount} USD</p>
            </div>
            <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d]">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Currency</p>
              <p className="text-xl font-bold text-white mt-1">{currency}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d]">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Tx Reference</p>
              <p className="text-sm font-mono text-[#0DCB3D] mt-1 break-all">{reference}</p>
            </div>
            <div className="p-4 rounded-xl border border-[#222] bg-[#0d0d0d]">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
              <p className="text-sm font-semibold text-white mt-1">{dateStr}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
              Share Your Support
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                    '_blank'
                  )
                }
              >
                <Share2 size={14} /> Twitter / X
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                    '_blank'
                  )
                }
              >
                Facebook
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
                    '_blank'
                  )
                }
              >
                <MessageSquare size={14} /> WhatsApp
              </Button>
              <Button variant="ghost" size="sm" onClick={copyLink}>
                <Copy size={14} /> Copy Link
              </Button>
            </div>
          </div>

          <Link href="/">
            <Button variant="primary" size="lg">
              <ArrowLeft size={16} /> Back to Home
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="py-32 text-center text-gray-400">Loading confirmation...</div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
