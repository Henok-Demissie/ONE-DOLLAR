'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

const quickLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#donate', label: 'Donate' },
  { href: '/#hire', label: 'Hire Me' },
  { href: '/#supporters', label: 'Supporters' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#about', label: 'About' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/donation-policy', label: 'Donation Policy' },
];

const socialLinks = [
  { href: 'https://github.com/Henok-Demissie/ONE-DOLLAR', label: 'GitHub', icon: Github },
  { href: '#', label: 'Twitter / X', icon: Twitter },
  { href: '#', label: 'LinkedIn', icon: Linkedin },
  { href: 'mailto:contact@onedollarproject.org', label: 'Email', icon: Mail },
];

export function Footer() {
  const year = new Date().getFullYear();

  const handleScroll = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#05070c] relative">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-300 to-green-400 flex items-center justify-center font-['Outfit'] font-black text-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                $1
              </div>
              <span className="text-lg font-['Outfit'] font-bold tracking-tight text-white">
                One Dollar <span className="text-slate-500 font-normal">Project</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.
              <br />
              A transparent journey to build meaningful open software, products, and communities through the collective power of micro-support.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-emerald-400 hover:border-emerald-400/40 hover:bg-white/[0.05] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-4 uppercase tracking-wider font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleScroll(link.href)}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-4 uppercase tracking-wider font-mono">
              Compliance &amp; Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={12} className="opacity-40" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All donations are voluntary and non-refundable. Contributions do not constitute an investment, loan, or purchase of equity.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {year} One Dollar Project. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono">Settlement Rails: Binance Pay • FedNow • Lead Bank • NOWPayments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
