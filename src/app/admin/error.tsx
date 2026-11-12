'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle size={24} />
        </div>
        <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
        <p className="text-sm text-white/50">
          {error.message || 'An unexpected error occurred while loading this admin view.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold transition-colors"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  );
}
