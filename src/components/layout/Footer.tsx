'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

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
  { href: '#', label: 'GitHub', icon: Github },
  { href: '#', label: 'Twitter / X', icon: Twitter },
  { href: '#', label: 'LinkedIn', icon: Linkedin },
  { href: '#', label: 'Email', icon: Mail },
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
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                ONE DOLLAR
              </span>
              <span className="text-2xl font-black tracking-tight text-white/40 ml-2">PROJECT</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.
              <br />
              A journey to build something meaningful through technology, creativity, and the
              collective support of people who believe in the dream.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#222] text-gray-500 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleScroll(link.href)}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink size={12} className="opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 rounded-lg border border-[#1a1a1a] bg-[#0d0d0d]">
              <p className="text-xs text-gray-600 leading-relaxed">
                All donations are voluntary and non-refundable. This is not an investment.
                No equity or returns are offered.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {year} One Dollar Project. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built with ❤️ and{' '}
            <span className="text-amber-600">$1 at a time.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
