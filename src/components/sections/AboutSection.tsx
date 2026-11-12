'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Target, Award, UserCheck, Code2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SKILLS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_ABOUT =
  'I am a passionate full-stack developer and AI builder dedicated to turning ambitious ideas into real-world digital products. Every $1 donated fuels infrastructure, open-source tools, and the pursuit of a million-dollar dream built with transparency and grit.';

const TIMELINE = [
  {
    year: 'Phase 01',
    title: 'The Spark & First Lines of Code',
    description: 'Started building web apps and automating everyday workflows from scratch.',
    icon: Sparkles,
  },
  {
    year: 'Phase 02',
    title: 'Full-Stack & AI Systems',
    description: 'Expanded into Next.js, cloud backends, machine learning, and intelligent automation.',
    icon: Rocket,
  },
  {
    year: 'Phase 03',
    title: 'Launching One Dollar Project',
    description: 'Opened the journey to the world—proving that small $1 contributions can compound into huge impact.',
    icon: Target,
  },
  {
    year: 'Phase 04',
    title: 'Shipping Products & Delivering for Clients',
    description: 'Building high-impact software for startups, businesses, and community supporters.',
    icon: Award,
  },
];

export function AboutSection() {
  const [aboutText, setAboutText] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return;
    }
    const supabase = createClient();
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'about_text')
      .single()
      .then(({ data }) => {
        if (data?.value) setAboutText(data.value);
      });
  }, []);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-amber-400/25 bg-amber-400/5 text-amber-400 mb-4 backdrop-blur-md">
            <UserCheck size={12} className="text-amber-400" />
            <span>The Story Behind The Dream</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 font-['Outfit']">
            About{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-extrabold">
              the builder
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left column: Story + Skills */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6 md:p-8 backdrop-blur-2xl">
              <h3 className="text-xl font-['Outfit'] font-bold text-white mb-4">Why One Dollar?</h3>
              <p className="text-slate-300 leading-relaxed mb-4 text-sm md:text-base">{aboutText}</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you contribute $1 to fuel the mission or hire me to bring your product to
                life, you become a direct part of this transparent journey.
              </p>
            </Card>

            <Card className="p-6 md:p-8 backdrop-blur-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-['Outfit'] font-bold text-white">Tech Stack &amp; Skills</h3>
                <Code2 size={18} className="text-amber-400" />
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-amber-400/40 hover:text-white transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{skill.name}</span>
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Right column: Visual Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 md:p-8 backdrop-blur-2xl">
              <h3 className="text-lg font-['Outfit'] font-bold text-white mb-6">Journey Timeline</h3>
              <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-amber-400 before:via-sky-400 before:to-transparent">
                {TIMELINE.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="relative flex gap-4 pl-1"
                    >
                      <div className="relative z-10 w-9 h-9 rounded-xl bg-[#0d121c] border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                        <Icon size={16} />
                      </div>
                      <div className="pb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                          {item.year}
                        </span>
                        <h4 className="text-base font-['Outfit'] font-bold text-white mt-0.5">{item.title}</h4>
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
    </section>
  );
}
