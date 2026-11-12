'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderGit2, Sparkles, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import type { PortfolioProject } from '@/types';
import { cn } from '@/lib/utils';

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-anthropic',
    title: 'Frontier LLM Evaluation & Code Intelligence',
    description:
      'Engineered rigorous evaluation harnesses, multi-turn code reasoning benchmarks, and prompt evaluation datasets on Revelo for Anthropic frontier models.',
    tech_stack: ['Python', 'LLM Evaluation', 'Prompt Engineering', 'Anthropic API'],
    project_url: '#',
    github_url: '#',
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-afterquery',
    title: 'Afterquery — Real-Time Query Pipeline (Y Combinator)',
    description:
      'Engineered high-performance backend data ingestion pipelines and database indexing for Afterquery (YC-backed), cutting query latencies and cloud infrastructure overhead.',
    tech_stack: ['FastAPI', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
    project_url: '#',
    github_url: '#',
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-sparck',
    title: 'Sparck — AI Social Media Platform (Eskalate)',
    description:
      'Led a 15-member team in Palo Alto to architect and ship Sparck. Built 50+ RESTful APIs with OAuth2/JWT auth, reduced lead time by 30% with Redis caching, and maintained 98.9% uptime.',
    tech_stack: ['FastAPI', 'Next.js', 'Redis', 'WebSockets', 'Docker', 'CI/CD'],
    project_url: '#',
    github_url: '#',
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-robotic-games',
    title: 'SimHash Deduplication & Low-Latency Engine',
    description:
      'Engineered SimHash deduplication with adaptive Hamming thresholds cutting redundant analysis by 60-80% at Robotic Games Inc. (SF Founders), plus a sub-20ms WebExtensions content scanner.',
    tech_stack: ['Python', 'FastAPI', 'Redis', 'React', 'AWS'],
    project_url: '#',
    github_url: '#',
    is_featured: false,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-career-pilot',
    title: 'Career Pilot — AI Career Guidance Platform',
    description:
      'Designed a responsive Next.js frontend with Framer Motion and integrated FastAPI microservices serving 280+ monthly active users with strict OAuth 2.0 role-based access control.',
    tech_stack: ['Next.js', 'FastAPI', 'Framer Motion', 'OAuth 2.0'],
    project_url: '#',
    github_url: '#',
    is_featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-quizme',
    title: 'QuizMe — Adaptive RAG & Vector Search System',
    description:
      'Engineered an adaptive quiz engine using RAG pipelines, vector search (FAISS & Pinecone), and prompt orchestration processing 80+ quizzes/day. Ranked Top 30 nationally out of 1,000+ teams.',
    tech_stack: ['LangChain', 'FAISS', 'Pinecone', 'Django', 'Python'],
    project_url: '#',
    github_url: '#',
    is_featured: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];

export function PortfolioSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>(FALLBACK_PROJECTS);
  const [selectedTech, setSelectedTech] = useState<string>('All');

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return;
    }
    const supabase = createClient();
    supabase
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(data as PortfolioProject[]);
        }
      });
  }, []);

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tech_stack?.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (selectedTech === 'All') return projects;
    return projects.filter((p) => p.tech_stack?.includes(selectedTech));
  }, [projects, selectedTech]);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#0DCB3D]/30 bg-[#0DCB3D]/10 text-[#0DCB3D] mb-4 backdrop-blur-md">
            <Layers size={12} className="text-[#0DCB3D]" />
            <span>Engineering Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2.5 font-['Outfit']">
            Featured{' '}
            <span className="bg-gradient-to-r from-[#0DCB3D] via-[#1EE94F] to-[#2cf05d] bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_15px_rgba(13,203,61,0.4)]">
              portfolio
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            A curated showcase of real-world products, autonomous pipelines, and experimental systems I&apos;ve engineered.
          </p>
        </motion.div>

        {/* Astryx Tech Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {allTechs.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(tech)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer',
                selectedTech === tech
                  ? 'border-[#0DCB3D] bg-gradient-to-r from-[#1EE94F] via-[#0DCB3D] to-[#0AA832] text-black font-bold shadow-md shadow-[#0DCB3D]/30'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-[#0DCB3D]/40 hover:text-white hover:bg-white/[0.05]'
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Astryx Product Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <div className="astryx-card overflow-hidden h-full flex flex-col group hover:border-[#0DCB3D]/50 transition-all duration-300">
                <div className="relative h-48 w-full bg-gradient-to-br from-[#0f1422] via-[#090d16] to-[#06080e] border-b border-white/[0.08] flex items-center justify-center overflow-hidden">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-emerald-400 transition-colors">
                      <FolderGit2 size={44} className="stroke-[1.5]" />
                    </div>
                  )}
                  {project.is_featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-['Outfit'] font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-3.5 border-t border-white/[0.06]">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <ExternalLink size={13} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                      >
                        <Github size={13} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
