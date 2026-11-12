'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  Briefcase,
  Image,
  FileText,
  Settings,
  X,
  Menu,
  DollarSign,
  LogOut,
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/donations', icon: Heart, label: 'Donations' },
  { href: '/admin/hire-requests', icon: Briefcase, label: 'Hire Requests' },
  { href: '/admin/portfolio', icon: Image, label: 'Portfolio' },
  { href: '/admin/content', icon: FileText, label: 'Content' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

interface AdminSidebarProps {
  adminEmail?: string;
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <DollarSign size={16} className="text-black font-bold" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">ONE DOLLAR</p>
            <p className="text-xs text-white/40 leading-none mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} className={active ? 'text-gold-400' : ''} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5">
        {adminEmail && (
          <p className="px-3 pb-2 text-xs text-white/30 truncate">{adminEmail}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#111111] border border-white/10 text-white/60 hover:text-white"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={clsx(
          'lg:hidden fixed left-0 top-0 h-full z-50 w-64 bg-[#0a0a0a] border-r border-white/5 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0a0a0a] border-r border-white/5 fixed left-0 top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
