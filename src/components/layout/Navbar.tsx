'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#donate', label: 'Donate' },
  { href: '/#hire', label: 'Hire Me' },
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/#supporters', label: 'Supporters' },
  { href: '/#about', label: 'About' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-black font-black text-sm shadow-md shadow-amber-500/25">
                $1
              </div>
              <div className="flex items-center gap-1.5 font-['Outfit']">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  One Dollar
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                  Project
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-150"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="primary"
                size="sm"
                className="hidden md:inline-flex text-xs px-4 font-semibold tracking-wide"
                onClick={() => handleNavClick('/#donate')}
              >
                Donate $1
              </Button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/97 backdrop-blur-md border-b border-[#222] md:hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-[#222] mt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => handleNavClick('/#donate')}
                >
                  DONATE $1 NOW
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
