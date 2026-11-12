'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

// Particle component rendered in CSS
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: ((i * 3) % 4) + 2,
            height: ((i * 3) % 4) + 2,
            left: `${(i * 17 + 7) % 96 + 2}%`,
            top: `${(i * 23 + 11) % 92 + 4}%`,
            background:
              i % 3 === 0
                ? 'rgba(245,158,11,0.6)'
                : i % 3 === 1
                ? 'rgba(14,165,233,0.4)'
                : 'rgba(255,255,255,0.2)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: (i * 0.3) % 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    const donate = document.getElementById('stats');
    if (donate) donate.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDonate = () => {
    const el = document.getElementById('donate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHire = () => {
    const el = document.getElementById('hire');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #0ea5e9 40%, transparent 70%)',
        }}
      />

      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Astryx Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 mb-8 shadow-sm backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              ONE DOLLAR PROJECT · THE GLOBAL DREAM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] tracking-tight text-white mb-6 font-['Outfit',sans-serif]"
          >
            ONE DOLLAR CAN HELP BUILD A{' '}
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent underline decoration-amber-500/30 decoration-wavy underline-offset-8">
              MILLION-DOLLAR
            </span>{' '}
            DREAM.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            I&apos;m building my future through technology, creativity, and innovation. If my
            vision inspires you, support my journey with just{' '}
            <span className="text-amber-400 font-bold">$1</span>. Every contribution creates
            extraordinary possibilities.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Button variant="primary" size="lg" onClick={scrollToDonate} className="min-w-[190px] text-sm">
              💛 DONATE $1
            </Button>
            <Button variant="secondary" size="lg" onClick={scrollToHire} className="min-w-[190px] text-sm">
              HIRE ME
            </Button>
          </motion.div>

          {/* Astryx KPI Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-3 max-w-lg mx-auto"
          >
            {[
              { label: 'Minimum', value: '$1 USD' },
              { label: 'Target Goal', value: '$1,000,000' },
              { label: 'Supporters', value: 'Global' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md flex flex-col items-center justify-center gap-0.5"
              >
                <span className="text-sm sm:text-base font-extrabold text-white font-mono">{item.value}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 hover:text-amber-400 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
