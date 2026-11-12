'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Target, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
    <section id="about" className="py-24 bg-[#080808]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            The Story Behind The Dream
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            ABOUT{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              THE BUILDER
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left column: Story + Skills */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Why One Dollar?</h3>
              <p className="text-gray-400 leading-relaxed mb-4">{aboutText}</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Whether you contribute $1 to fuel the mission or hire me to bring your product to
                life, you become a direct part of this story.
              </p>
            </Card>

            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-4">Tech Stack &amp; Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Badge
                    key={skill.name}
                    label={`${skill.name}`}
                    className="px-3 py-1 text-xs border-[#333] bg-[#141414] text-gray-200 hover:border-amber-500/50 transition-colors"
                  />
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
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-white mb-6">Journey Timeline</h3>
              <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-amber-500 before:via-sky-500 before:to-transparent">
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
                      <div className="relative z-10 w-9 h-9 rounded-full bg-[#111] border border-amber-500/50 flex items-center justify-center shrink-0 text-amber-400">
                        <Icon size={16} />
                      </div>
                      <div className="pb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                          {item.year}
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">{item.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
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
