'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ChevronDown, ArrowRight, FileText } from 'lucide-react';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [stats, setStats] = useState({
    totalRaised: 0,
    goalAmount: 1000000,
    goalProgress: 0,
  });

  useEffect(() => {
    fetch('/api/public/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.total_raised_usd === 'number') {
          const totalRaised = data.total_raised_usd;
          const goalAmount = data.goal_amount ?? 1000000;
          const goalProgress = goalAmount > 0 ? (totalRaised / goalAmount) * 100 : 0;
          setStats({ totalRaised, goalAmount, goalProgress });
        }
      })
      .catch(() => {});
  }, []);

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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] bg-[#0DCB3D]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[320px] h-[320px] bg-[#0DCB3D]/[0.05] rounded-full blur-[110px] pointer-events-none" />

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
          {/* Top Single Focus Badge — Replaces the duplicated chips */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#0DCB3D]/30 bg-[#0DCB3D]/10 text-[#0DCB3D] mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(13,203,61,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D] animate-pulse shadow-[0_0_8px_#0DCB3D]" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Henok Demissie • Proof-of-Possibility Experiment</span>
          </div>

          {/* Refined Headline — Bright Green with Gradiented Light (#0DCB3D) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12] font-['Outfit'] mb-5">
            One dollar can help build a{' '}
            <span className="bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_25px_rgba(13,203,61,0.4)]">
              million-dollar
            </span>{' '}
            dream.
          </h1>

          {/* Authentic Personal Story Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            I am an AI &amp; Software Engineer who built for Silicon Valley and YC startups—currently standing at <strong className="text-white font-mono">$0.00</strong> in Addis Ababa. This is a radical movement to prove talent has no borders with $1 micro-backing, build transformative ventures, and elevate Ethiopia&apos;s tech industry.
          </p>

          {/* Campaign Goal Progress Bar — Sleek Low-Profile Hero Card */}
          <div className="max-w-lg mx-auto rounded-xl border border-white/[0.08] bg-[#0c111a]/85 backdrop-blur-xl py-2.5 px-4 sm:px-5 shadow-xl shadow-black/50 hover:border-[#0DCB3D]/30 transition-all text-left mb-7">
            <ProgressBar
              value={stats.goalProgress}
              raised={stats.totalRaised}
              goal={stats.goalAmount}
              label="Campaign Goal Progress"
              compact
              size="sm"
            />
          </div>

          {/* Astryx Styled CTAs including Resume PDF */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Button
              variant="primary"
              size="md"
              onClick={scrollToDonate}
              className="px-6 py-2.5 text-xs font-semibold tracking-wide shadow-lg shadow-[#0DCB3D]/30"
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
            <a
              href="/Henok_Demissie_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0DCB3D]/40 bg-[#0DCB3D]/10 hover:bg-[#0DCB3D]/20 text-[#0DCB3D] text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
            >
              <FileText size={14} />
              <span>Resume (PDF)</span>
            </a>
          </div>

          {/* Astryx Sleek Telemetry Strip */}
          <div className="max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0c111a]/70 backdrop-blur-xl p-4 shadow-xl">
            <div className="grid grid-cols-3 divide-x divide-white/[0.06] text-center">
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Starting Balance</span>
                <span className="font-mono text-sm sm:text-base font-bold text-white">$0.00 (Live)</span>
              </div>
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Target</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#0DCB3D]">$1,000,000</span>
              </div>
              <div className="px-2">
                <span className="block text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Rails</span>
                <span className="font-mono text-xs sm:text-sm font-semibold text-[#0DCB3D]">Card • USDT (BEP-20)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        type="button"
        onClick={scrollToNext}
        className="mt-12 flex flex-col items-center gap-1.5 text-slate-500 hover:text-[#0DCB3D] transition-colors text-xs cursor-pointer group"
        aria-label="Scroll to stats"
      >
        <span className="text-[11px] tracking-widest uppercase font-medium">Explore Details</span>
        <ChevronDown size={16} className="transition-transform group-hover:translate-y-0.5" />
      </button>
    </section>
  );
}
