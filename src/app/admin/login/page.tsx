'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Login failed. Please check your credentials.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 mb-4 shadow-lg shadow-gold-500/20">
            <DollarSign size={28} className="text-black font-bold" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">ONE DOLLAR PROJECT</h1>
          <p className="text-white/40 text-sm mt-1">Admin Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex gap-2 items-start p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Authenticating…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          ONE DOLLAR PROJECT · Admin Portal · Restricted Access
        </p>
      </div>
    </div>
  );
}
