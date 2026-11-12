'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createClient } from '@/lib/supabase/client';
import type { PortfolioProject } from '@/types';
import { cn } from '@/lib/utils';

const FALLBACK_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'One Dollar Project Platform',
    description:
      'Full-stack crypto donation platform & portfolio built with Next.js 14, Supabase, Framer Motion, and an admin verification suite.',
    tech_stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    project_url: '#',
    github_url: '#',
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    title: 'AI Workflow Automation Suite',
    description:
      'Autonomous multi-agent pipeline integrating LLMs, webhooks, and scheduled reporting for modern SaaS teams.',
    tech_stack: ['Python', 'Next.js', 'AI/ML', 'PostgreSQL'],
    project_url: '#',
    github_url: '#',
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Real-Time Analytics Dashboard',
    description:
      'High-throughput telemetry dashboard tracking live metrics, user cohorts, and automated anomaly alerts.',
    tech_stack: ['React', 'Node.js', 'TypeScript', 'Docker'],
    project_url: '#',
    github_url: '#',
    is_featured: false,
    sort_order: 3,
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
    <section id="portfolio" className="py-24 bg-[#080808]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Selected Work
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            FEATURED{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A glimpse at the products, systems, and experiments I&apos;ve built.
          </p>
        </motion.div>

        {/* Tech filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {allTechs.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(tech)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all',
                selectedTech === tech
                  ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                  : 'border-[#222] bg-[#111] text-gray-400 hover:border-[#444] hover:text-white'
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
            >
              <Card hover glow="blue" className="overflow-hidden h-full flex flex-col">
                <div className="relative h-44 w-full bg-gradient-to-br from-[#141414] via-[#111] to-[#0a0a0a] border-b border-[#222] flex items-center justify-center">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <FolderGit2 size={40} className="text-amber-500/40" />
                  )}
                  {project.is_featured && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[11px] font-semibold">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech_stack?.map((tech) => (
                      <Badge key={tech} label={tech} />
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-[#1e1e1e]">
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        <Github size={14} /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
