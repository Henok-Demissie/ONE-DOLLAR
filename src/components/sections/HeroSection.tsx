'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    const stats = document.getElementById('stats');
    if (stats) stats.scrollIntoView({ behavior: 'smooth' });
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
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Subtle Astryx ambient green lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[320px] h-[320px] bg-teal-400/[0.05] rounded-full blur-[110px] pointer-events-none" />

      {/* Grid line texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Astryx Precision Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="font-mono text-[11px] uppercase tracking-wider">The Proof-of-Possibility Experiment</span>
          </div>

          {/* Refined Headline — Bright Green with Gradiented Light */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.16] font-['Outfit'] mb-5">
            One dollar can help build a{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-green-300 bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              million-dollar
            </span>{' '}
            dream.
          </h1>

          {/* Clean Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Building software, autonomous systems, and modern digital products. Support the vision with just $1, or hire me to bring your project to life.
          </p>

          {/* Astryx Styled CTAs */}
          <div className="flex flex-row items-center justify-center gap-3 mb-12">
            <Button
              variant="primary"
              size="md"
              onClick={scrollToDonate}
              className="px-6 py-2.5 text-xs font-semibold tracking-wide shadow-lg shadow-emerald-500/25"
            >
              <span>Donate $1</span>
              <ArrowRight size={14} />
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={scrollToHire}
              className="px-6 py-2.5 text-xs font-semibold tracking-wide"
            >
              <span>Hire Me</span>
            </Button>
          </div>

          {/* Astryx Sleek Telemetry Strip */}
          <div className="max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0c111a]/70 backdrop-blur-xl p-4 shadow-xl">
            <div className="grid grid-cols-3 divide-x divide-white/[0.06] text-center">
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Micro Goal</span>
                <span className="font-mono text-sm sm:text-base font-bold text-emerald-400">$1 Minimum</span>
              </div>
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Target</span>
                <span className="font-mono text-sm sm:text-base font-bold text-white">$1,000,000</span>
              </div>
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Rails</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-emerald-400">FedNow • BSC (BEP-20)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        type="button"
        onClick={scrollToNext}
        className="mt-12 flex flex-col items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors text-xs cursor-pointer group"
        aria-label="Scroll to stats"
      >
        <span className="text-[11px] tracking-widest uppercase font-medium">Explore Details</span>
        <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
      </button>
    </section>
  );
}
