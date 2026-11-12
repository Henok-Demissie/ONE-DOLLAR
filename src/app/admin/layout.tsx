'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/donations': 'Donations',
  '/admin/hire-requests': 'Hire Requests',
  '/admin/portfolio': 'Portfolio',
  '/admin/content': 'Site Content',
  '/admin/settings': 'Settings',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          if (!cancelled) router.replace('/admin/login');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          if (!cancelled) router.replace('/admin/login');
          return;
        }
        if (!cancelled) {
          setAdminEmail(data.email ?? '');
          setAuthenticated(true);
        }
      } catch {
        if (!cancelled) router.replace('/admin/login');
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-gold-400" />
          <p className="text-sm text-white/50">Verifying admin session…</p>
        </div>
      </div>
    );
  }

  const pageTitle =
    Object.entries(PAGE_TITLES).find(
      ([path]) => pathname === path || pathname.startsWith(path + '/')
    )?.[1] ?? 'Admin';

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar adminEmail={adminEmail} />

      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-6 lg:px-8 flex items-center justify-between">
          <div className="pl-10 lg:pl-0 flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-white">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-white/5 text-xs text-white/60">
              <ShieldCheck size={14} className="text-gold-400" />
              <span className="max-w-[200px] truncate">{adminEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
