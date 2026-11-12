'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Trophy,
  Code2,
  CheckCircle2,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#0a0e17] text-white p-5 sm:p-8 shadow-2xl shadow-black z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b border-white/[0.08] mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#0DCB3D] bg-[#0DCB3D]/10 border border-[#0DCB3D]/30 mb-2 font-mono">
                <Sparkles size={12} />
                <span>Verified Curriculum Vitae</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] text-white">
                Henok Demissie
              </h2>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                Software Engineer &amp; ML / Systems Engineer
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#0DCB3D]" /> Addis Ababa, Ethiopia
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-[#0DCB3D]" /> henokdemissie13@gmail.com
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/Henok_Demissie_Resume.pdf"
                download="Henok_Demissie_Resume.pdf"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0DCB3D] text-black font-extrabold text-xs hover:brightness-110 shadow-md shadow-[#0DCB3D]/30 transition-all cursor-pointer"
              >
                <Download size={13} />
                <span>Download PDF</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Credential Highlights Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl border border-[#0DCB3D]/25 bg-[#0DCB3D]/[0.05] mb-6 text-center">
            <div className="p-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Competitive Ranking</span>
              <span className="text-xs sm:text-sm font-bold text-[#0DCB3D] font-mono">Top 5% Codeforces</span>
            </div>
            <div className="p-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Championship</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">ACPC Finalist</span>
            </div>
            <div className="p-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">AI Work</span>
              <span className="text-xs sm:text-sm font-bold text-[#0DCB3D] font-mono">Anthropic (Revelo)</span>
            </div>
            <div className="p-1">
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Startup Track</span>
              <span className="text-xs sm:text-sm font-bold text-white font-mono">Afterquery (YC)</span>
            </div>
          </div>

          {/* Body Sections */}
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Experience */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
                <Briefcase size={16} className="text-[#0DCB3D]" />
                <span>Work &amp; Engineering Experience</span>
              </div>
              <div className="space-y-3.5">
                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Anthropic — LLM Evaluation &amp; Code Intelligence</h4>
                      <p className="text-xs text-[#0DCB3D] font-medium">via Revelo Platform</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">Recent</span>
                  </div>
                  <p className="text-slate-300 mt-2 leading-relaxed text-xs">
                    Engineered evaluation harnesses, multi-turn code reasoning benchmarks, and prompt evaluation datasets for frontier Claude/Anthropic LLM capabilities.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Afterquery — Query Pipeline Infrastructure</h4>
                      <p className="text-xs text-[#0DCB3D] font-medium">Y Combinator (YC) Backed</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">Palo Alto, CA</span>
                  </div>
                  <p className="text-slate-300 mt-2 leading-relaxed text-xs">
                    Built high-performance backend pipelines and optimized database indexing in FastAPI and PostgreSQL, lowering cloud overhead and reducing query latency.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Robotic Games Inc. — Software Engineer</h4>
                      <p className="text-xs text-slate-400">San Francisco, CA (Funded by Founders)</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">08/2025 – Present</span>
                  </div>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300 text-xs leading-relaxed">
                    <li>Applied SimHash deduplication with adaptive Hamming thresholds, reducing redundant analyses by 60-80% using Python &amp; Redis.</li>
                    <li>Lowered API costs by 60% and reduced median latency from 2.3s to 0.8s on AWS content-matching pipelines.</li>
                    <li>Developed sub-20ms WebExtensions browser content filter and &lt;370ms FastAPI backend.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Africa to Silicon Valley (A2SV) — Head of Education</h4>
                      <p className="text-xs text-slate-400">Adama, Ethiopia</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">01/2025 – Present</span>
                  </div>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300 text-xs leading-relaxed">
                    <li>Mentored 60+ students in software engineering and advanced algorithms; organized 19 algorithmic contests resulting in 22 global placements.</li>
                    <li>Awarded <strong>Best Lecturer</strong> among eight educators for top instructional quality.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Eskalate — Project Lead (Sparck AI Platform)</h4>
                      <p className="text-xs text-slate-400">Palo Alto, CA</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">12/2024 – 08/2025</span>
                  </div>
                  <p className="text-slate-300 mt-2 leading-relaxed text-xs">
                    Led a 15-member team to build Sparck (multichannel AI publishing). Shipped 50+ RESTful APIs with OAuth2/JWT auth, cut lead time by 30% with Redis caching, maintained 98.9% uptime.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
                <GraduationCap size={16} className="text-[#0DCB3D]" />
                <span>Education &amp; Academic Background</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">Adama Science and Technology University</h4>
                  <p className="text-xs text-[#0DCB3D] font-mono font-semibold">B.Sc. Software Engineering (CGPA: 3.82 / 4.0)</p>
                  <p className="text-[11px] text-slate-400 mt-1">05/2022 – 06/2026 • Adama, Ethiopia</p>
                  <p className="text-xs text-slate-300 mt-2">
                    Advanced Algorithms, Distributed Systems, AI, Information Retrieval, Concurrency, C++, Networks.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <h4 className="font-bold text-white text-sm">EPIC Institute of Technology</h4>
                  <p className="text-xs text-[#0DCB3D] font-mono font-semibold">Real-Time Backend Systems Program</p>
                  <p className="text-[11px] text-slate-400 mt-1">07/2025 – 05/2026 • Newtown, PA</p>
                  <p className="text-xs text-slate-300 mt-2">
                    Distributed architectures, Raft consensus, fault-tolerant design, large-scale AWS/Docker pipelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white uppercase tracking-wider font-['Outfit']">
                <Trophy size={16} className="text-[#0DCB3D]" />
                <span>Key Honors &amp; Competitive Accolades</span>
              </div>
              <div className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-[#0DCB3D] shrink-0" />
                  <span><strong>ACPC Finalist:</strong> African and Arab Collegiate Programming Championship Finalist.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-[#0DCB3D] shrink-0" />
                  <span><strong>Codeforces Expert:</strong> Ranked Top 5% globally among competitive algorithmic programmers.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-[#0DCB3D] shrink-0" />
                  <span><strong>500+ Algorithmic Challenges:</strong> Solved on LeetCode and Codeforces across complex graph theory and dynamic programming.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-[#0DCB3D] shrink-0" />
                  <span><strong>A2SV GenAI Hackathon:</strong> Continental Semi-Finalist for AI in Africa.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Available immediately for contract, freelance, or full-time engineering.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="/Henok_Demissie_Resume.pdf"
                download="Henok_Demissie_Resume.pdf"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0DCB3D] text-black font-extrabold text-xs hover:brightness-110 shadow-lg shadow-[#0DCB3D]/30 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Download Official PDF</span>
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  const el = document.getElementById('hire');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Hire Henok</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

