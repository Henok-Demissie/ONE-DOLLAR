'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Code,
  Brain,
  Cpu,
  Zap,
  Terminal,
  Building,
  Lightbulb,
  Send,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const HIRE_SERVICES = [
  {
    title: 'Website Development',
    description: 'High-converting, responsive landing pages, marketing sites, and brand experiences with Next.js.',
    icon: Globe,
    color: 'gold' as const,
    badge: 'Popular',
  },
  {
    title: 'Full-Stack Development',
    description: 'End-to-end web apps with Next.js, React, Node.js, PostgreSQL, and cloud serverless infra.',
    icon: Code,
    color: 'blue' as const,
    badge: 'Full Stack',
  },
  {
    title: 'AI Solutions',
    description: 'Custom LLM agents, RAG pipelines, AI copilots, and intelligent workflow integrations.',
    icon: Brain,
    color: 'gold' as const,
    badge: 'Trending',
  },
  {
    title: 'Machine Learning',
    description: 'Predictive modeling, computer vision, NLP pipelines, and production model deployment.',
    icon: Cpu,
    color: 'blue' as const,
    badge: 'Data & ML',
  },
  {
    title: 'Automation Systems',
    description: 'Autonomous workflow bots, data scrapers, webhooks, and multi-API cloud orchestration.',
    icon: Zap,
    color: 'gold' as const,
    badge: 'High ROI',
  },
  {
    title: 'Software Development',
    description: 'Robust backend services, CLI tools, microservices, and scalable software architecture.',
    icon: Terminal,
    color: 'blue' as const,
    badge: 'Core Eng',
  },
  {
    title: 'Business Tech Solutions',
    description: 'Custom CRMs, internal telemetry dashboards, payment checkout, and SaaS foundations.',
    icon: Building,
    color: 'gold' as const,
    badge: 'Enterprise',
  },
  {
    title: 'Technical Consulting',
    description: 'Architecture audits, performance tuning, MVP roadmapping, and tech stack advisory.',
    icon: Lightbulb,
    color: 'blue' as const,
    badge: 'Advisory',
  },
];

const BUDGET_RANGES = [
  'Under $500',
  '$500 - $1,500',
  '$1,500 - $5,000',
  '$5,000 - $15,000',
  '$15,000+',
];

export function HireMeSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    project_type: 'Website Development',
    budget: '$1,500 - $5,000',
    description: '',
    deadline: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSelectService = (title: string) => {
    setForm((prev) => ({ ...prev, project_type: title }));
    const formEl = document.getElementById('hire-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Valid email is required';
    if (form.description.trim().length < 20)
      next.description = 'Please describe your project (at least 20 characters)';
    if (!form.deadline.trim()) next.deadline = 'Target deadline or timeline is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/hire-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          project_type: form.project_type,
          budget_range: form.budget,
          description: form.description.trim(),
          deadline: form.deadline.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedId(data.id);
        toast.success("Inquiry received! I'll get back to you within 24 hours.");
        setForm({
          name: '',
          email: '',
          company: '',
          project_type: 'Website Development',
          budget: '$1,500 - $5,000',
          description: '',
          deadline: '',
        });
      } else {
        toast.error(data.error || 'Failed to submit inquiry');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hire" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-sky-400/25 bg-sky-400/5 text-sky-400 mb-4 backdrop-blur-md">
            <Briefcase size={12} className="text-sky-400" />
            <span>Services &amp; Engineering Consultation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 font-['Outfit']">
            Let&apos;s build something{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent font-extrabold">
              great together.
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Need a high-velocity full-stack developer, AI engineer, or technical partner? Select any service below to customize your project brief.
          </p>
        </motion.div>

        {/* 8 Astryx-styled Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-16">
          {HIRE_SERVICES.map((service, idx) => {
            const Icon = service.icon;
            const isSelected = form.project_type === service.title;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
              >
                <div
                  onClick={() => handleSelectService(service.title)}
                  className={cn(
                    'astryx-card p-5 h-full flex flex-col justify-between gap-4 cursor-pointer relative transition-all duration-300 group',
                    isSelected
                      ? 'border-amber-400/80 bg-amber-400/[0.06] shadow-[0_0_24px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/40'
                      : 'hover:border-white/20 hover:bg-white/[0.04]'
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
                          service.color === 'gold'
                            ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25'
                            : 'bg-sky-400/15 text-sky-400 border border-sky-400/25'
                        )}
                      >
                        <Icon size={19} />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-['Outfit'] font-bold text-white group-hover:text-amber-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1.5 line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-semibold flex items-center gap-1 transition-colors',
                        isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-white'
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check size={13} className="stroke-[3]" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Select Service</span>
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hire Me Form */}
        <div id="hire-form" className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
            {submittedId ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-['Outfit'] font-bold text-white mb-2">Inquiry Submitted!</h3>
                <p className="text-slate-300 text-sm mb-6">
                  Thank you for reaching out. Your request ID is{' '}
                  <code className="text-amber-400 font-mono font-bold">{submittedId.slice(0, 8)}</code>.
                  I&apos;ll review your project brief and reply within 24 hours.
                </p>
                <Button variant="secondary" onClick={() => setSubmittedId(null)}>
                  Send Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div>
                    <h3 className="text-xl font-['Outfit'] font-bold text-white">Start a Project Brief</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tell me about what you&apos;re building, timeline, and goals.
                    </p>
                  </div>
                  <div className="astryx-pill text-amber-400 border-amber-400/30 text-[11px] hidden sm:inline-flex">
                    {form.project_type}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Your Name *"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    error={errors.name}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company / Organization"
                    placeholder="Optional"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="project-type" className="text-sm font-medium text-slate-300">
                      Project Type *
                    </label>
                    <select
                      id="project-type"
                      value={form.project_type}
                      onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#090d15]/80 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer"
                    >
                      {HIRE_SERVICES.map((s) => (
                        <option key={s.title} value={s.title} className="bg-[#090d15] text-white">
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="budget-range" className="text-sm font-medium text-slate-300">
                      Estimated Budget *
                    </label>
                    <select
                      id="budget-range"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full rounded-xl border border-white/[0.08] bg-[#090d15]/80 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-400 transition-all cursor-pointer"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b} className="bg-[#090d15] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Target Deadline *"
                    placeholder="e.g., 4 weeks / Dec 2026"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    error={errors.deadline}
                  />
                </div>

                <Textarea
                  label="Project Description *"
                  rows={4}
                  placeholder="Describe your project vision, target users, core features, and references..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  error={errors.description}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full justify-center" loading={loading}>
                  <Send size={16} />
                  <span>Submit Inquiry</span>
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Invoicing available via US Bank Transfer (FedNow, ACH, Wire via Lead Bank) &amp; Crypto</span>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
