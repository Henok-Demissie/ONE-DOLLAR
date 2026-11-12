'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  ExternalLink,
  Code2,
  Terminal,
  Trophy,
  GraduationCap,
  Briefcase,
  Sparkles,
  Heart,
  Globe2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SKILLS, SITE_CONFIG } from '@/lib/constants';
import { ResumeModal } from '@/components/ui/ResumeModal';

const CAREER_TIMELINE = [
  {
    phase: 'Phase 01',
    period: '2022 – 2024',
    title: 'Algorithmic Mastery & ASTU Honors',
    badge: 'CGPA 3.82 • Top 5% Global',
    description:
      'Pursued B.Sc. Software Engineering at Adama Science and Technology University (CGPA 3.82/4.0). Solved 500+ problems on LeetCode/Codeforces, earning Codeforces Expert status (Top 5% globally) and reaching the African & Arab Collegiate Programming Championship (ACPC) Finals.',
    icon: Trophy,
  },
  {
    phase: 'Phase 02',
    period: '2024 – 2025',
    title: 'Ecosystem Leadership & A2SV Mentorship',
    badge: 'Best Lecturer Award',
    description:
      'Served as Head of Education at Africa to Silicon Valley (A2SV). Mentored 60+ promising African developers and authored algorithmic contests, leading directly to 22 international placements. Awarded Best Lecturer among 8 educators.',
    icon: GraduationCap,
  },
  {
    phase: 'Phase 03',
    period: '2024 – 2025',
    title: 'Silicon Valley Engineering & Frontier AI',
    badge: 'Anthropic & YC Track',
    description:
      'Engineered frontier LLM evaluation and multi-turn code reasoning benchmarks on Revelo for Anthropic. Built scalable query pipelines for YC-backed Afterquery, and led a 15-person engineering team at Eskalate (Palo Alto) shipping 50+ APIs with 98.9% uptime.',
    icon: Briefcase,
  },
  {
    phase: 'Phase 04',
    period: '2026 – Present',
    title: 'The Proof-of-Possibility: Rise from $0.00',
    badge: 'The Global Dream',
    description:
      'Currently unemployed with $0.00 in bank balance in Addis Ababa due to local market constraints. Launched the One Dollar Project to prove that world-class talent can rise from zero through global micro-support, and commit the proceeds to lifting Ethiopia’s tech ecosystem.',
    icon: Sparkles,
  },
];

export function AboutSection() {
  const [resumeOpen, setResumeOpen] = useState(false);

  const scrollToDonate = () => {
    const el = document.getElementById('donate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHire = () => {
    const el = document.getElementById('hire');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background radial lighting (#0DCB3D) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#0DCB3D]/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#0DCB3D]/30 bg-[#0DCB3D]/10 text-[#0DCB3D] mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(13,203,61,0.25)]">
            <Terminal size={12} className="text-[#0DCB3D]" />
            <span>The Builder Behind the Screen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 font-['Outfit']">
            Henok Demissie{' '}
            <span className="bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent font-black drop-shadow-[0_0_20px_rgba(13,203,61,0.4)]">
              — The Story
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            From benchmarking LLMs for frontier labs and building for YC startups to standing at $0.00 today in Addis Ababa, Ethiopia.
          </p>
        </motion.div>

        {/* The Reality Paradox Card (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="astryx-card p-6 sm:p-8 md:p-10 border-[#0DCB3D]/30 bg-gradient-to-br from-[#0c131d]/90 via-[#070b12]/95 to-[#05080e] shadow-2xl relative overflow-hidden">
            {/* Top Badge Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0DCB3D]/15 border border-[#0DCB3D]/40 flex items-center justify-center text-[#0DCB3D] shadow-[0_0_15px_rgba(13,203,61,0.3)]">
                  <Globe2 size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                    The Modern Engineering Paradox
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Addis Ababa, Ethiopia 🇪🇹 • ASTU 3.82 CGPA • Top 5% Global Codeforces
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResumeOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-[#0DCB3D]/15 border border-white/[0.1] hover:border-[#0DCB3D]/50 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <FileText size={14} className="text-[#0DCB3D]" />
                  <span>Inspect CV</span>
                </button>
                <a
                  href="/Henok_Demissie_Resume.pdf"
                  download="Henok_Demissie_Resume.pdf"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0DCB3D] text-black font-extrabold text-xs hover:brightness-110 shadow-lg shadow-[#0DCB3D]/30 transition-all cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF Resume</span>
                </a>
              </div>
            </div>

            {/* Narrative Prose */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 text-sm leading-relaxed">
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0DCB3D] block">
                  01 // The Proven Track Record
                </span>
                <p>
                  I am a Software &amp; Machine Learning Engineer based in Addis Ababa. I&apos;ve evaluated frontier LLMs and complex reasoning benchmarks on <strong>Revelo for Anthropic</strong>, engineered scalable query pipelines for <strong>Afterquery (Y Combinator)</strong>, led a 15-member team on the Sparck AI platform at <strong>Eskalate (Palo Alto)</strong>, and built deduplication engines at <strong>Robotic Games (San Francisco)</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0DCB3D] block">
                  02 // The $0.00 Reality
                </span>
                <p>
                  Yet today, I am currently unemployed with literally <strong>$0.00 in my bank account</strong>. In emerging tech hubs like Ethiopia, despite elite talent, access to stable international contracts, venture funding, and foreign currency rails is brutally restricted. The gap between global capability and local opportunity remains massive.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0DCB3D] block">
                  03 // The Audacious Mission
                </span>
                <p>
                  I refuse to surrender to circumstance. As former <strong>Head of Education at A2SV</strong>, I mentored 60+ brilliant students and saw 22 land global software jobs. This project is my pledge: rise from $0 to build sustainable ventures, and channel resources back into <strong>elevating Ethiopia’s technology industry</strong> so our next generation builds for the world.
                </p>
              </div>
            </div>

            {/* Quick Stat Pill Bar */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
                  Worked with Anthropic (Revelo)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
                  YC Afterquery Track
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
                  ACPC Finalist &amp; Codeforces Expert
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.03] border border-white/[0.08] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
                  22 Global Student Placements (A2SV)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="primary" size="sm" onClick={scrollToDonate}>
                  <span>Fuel With $1</span>
                  <ArrowRight size={14} />
                </Button>
                <Button variant="secondary" size="sm" onClick={scrollToHire}>
                  <span>Hire Henok</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2-Column: Tech Stack & Career Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Skills & Core Competencies */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6 sm:p-8 backdrop-blur-2xl border-white/[0.08]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-['Outfit'] font-bold text-white">
                    Verified Technical Arsenal
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Production systems, distributed architectures &amp; AI
                  </p>
                </div>
                <Code2 size={20} className="text-[#0DCB3D]" />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {SKILLS.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-[#0DCB3D]/50 hover:text-white transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0DCB3D]" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#070a10] space-y-2.5">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono font-bold block">
                  Core Engineering Pillars
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0DCB3D]">✓</span> Distributed Raft Consensus
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0DCB3D]">✓</span> RAG &amp; Vector Databases
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0DCB3D]">✓</span> Sub-50ms Latency Tuning
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#0DCB3D]">✓</span> Microservices &amp; CI/CD
                  </div>
                </div>
              </div>
            </Card>

            {/* Education Highlight Card */}
            <Card className="p-6 sm:p-8 backdrop-blur-2xl border-white/[0.08]">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={20} className="text-[#0DCB3D]" />
                <h3 className="text-lg font-['Outfit'] font-bold text-white">Education &amp; Credentials</h3>
              </div>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="pb-3 border-b border-white/[0.06]">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">Adama Science and Technology University</h4>
                    <span className="text-[11px] font-mono text-slate-400">2022 – 2026</span>
                  </div>
                  <p className="text-xs text-[#0DCB3D] font-mono font-semibold mt-0.5">
                    B.Sc. Software Engineering — CGPA: 3.82 / 4.0
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Adama, Ethiopia • Highest academic honors in core systems and algorithms
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">EPIC Institute of Technology</h4>
                    <span className="text-[11px] font-mono text-slate-400">2025 – 2026</span>
                  </div>
                  <p className="text-xs text-[#0DCB3D] font-mono font-semibold mt-0.5">
                    Real-Time Backend Systems Program
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Newtown, PA • Distributed systems, Raft consensus, and fault-tolerant architecture
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Chronological Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 sm:p-8 backdrop-blur-2xl border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-['Outfit'] font-bold text-white">Career Evolution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">The milestones that shaped this mission</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResumeOpen(true)}
                  className="text-xs text-[#0DCB3D] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                >
                  <span>Full CV</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#0DCB3D] before:via-[#1EE94F] before:to-transparent">
                {CAREER_TIMELINE.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.phase}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08, duration: 0.4 }}
                      className="relative flex gap-4 pl-1"
                    >
                      <div className="relative z-10 w-9 h-9 rounded-xl bg-[#0d121c] border border-[#0DCB3D]/50 flex items-center justify-center shrink-0 text-[#0DCB3D] shadow-[0_0_12px_rgba(13,203,61,0.3)]">
                        <Icon size={16} />
                      </div>
                      <div className="pb-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0DCB3D] font-mono">
                            {item.phase} • {item.period}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08] truncate">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="text-base font-['Outfit'] font-bold text-white mt-1">
                          {item.title}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Interactive Resume Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}
