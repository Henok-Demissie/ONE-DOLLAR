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
            ? 'bg-black/95 backdrop-blur-md border-b border-[#222] shadow-lg shadow-black/50'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-yellow-200 transition-all">
                ONE DOLLAR
              </span>
              <span className="text-lg font-black tracking-tight text-white/60">PROJECT</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => handleNavClick('/#donate')}
              >
                DONATE $1
              </Button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
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
