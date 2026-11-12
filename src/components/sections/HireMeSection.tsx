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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

const HIRE_SERVICES = [
  {
    title: 'Website Development',
    description: 'High-converting, responsive landing pages, marketing sites, and brand experiences.',
    icon: Globe,
    color: 'gold' as const,
  },
  {
    title: 'Full-Stack Development',
    description: 'End-to-end web apps with Next.js, React, Node.js, PostgreSQL, and cloud infra.',
    icon: Code,
    color: 'blue' as const,
  },
  {
    title: 'AI Solutions',
    description: 'Custom LLM agents, RAG pipelines, AI copilots, and intelligent workflow integrations.',
    icon: Brain,
    color: 'gold' as const,
  },
  {
    title: 'Machine Learning',
    description: 'Predictive modeling, computer vision, NLP pipelines, and model deployment.',
    icon: Cpu,
    color: 'blue' as const,
  },
  {
    title: 'Automation Systems',
    description: 'End-to-end workflow automation, bots, scrapers, webhooks, and API orchestration.',
    icon: Zap,
    color: 'gold' as const,
  },
  {
    title: 'Software Development',
    description: 'Robust backend services, CLI tools, microservices, and scalable software architecture.',
    icon: Terminal,
    color: 'blue' as const,
  },
  {
    title: 'Business Tech Solutions',
    description: 'Custom CRMs, internal dashboards, payment systems, and SaaS platforms for growth.',
    icon: Building,
    color: 'gold' as const,
  },
  {
    title: 'Technical Consulting',
    description: 'Architecture audits, performance tuning, MVP roadmapping, and tech stack advisory.',
    icon: Lightbulb,
    color: 'blue' as const,
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
    <section id="hire" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Services &amp; Collaboration
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            LET&apos;S BUILD SOMETHING{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              GREAT TOGETHER.
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Need a developer, AI engineer, or technical partner? Click any service below or tell me
            about your project.
          </p>
        </motion.div>

        {/* 8 Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {HIRE_SERVICES.map((service, idx) => {
            const Icon = service.icon;
            const isSelected = form.project_type === service.title;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                <Card
                  hover
                  glow={service.color}
                  onClick={() => handleSelectService(service.title)}
                  className={`p-6 h-full flex flex-col gap-3 cursor-pointer ${
                    isSelected ? 'border-amber-500/70 bg-amber-500/5' : ''
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      service.color === 'gold'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-sky-500/15 text-sky-400'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white">{service.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <span className="text-xs font-semibold text-amber-400 mt-1">
                    {isSelected ? '✓ Selected' : 'Select service →'}
                  </span>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Hire Me Form */}
        <div id="hire-form" className="max-w-3xl mx-auto">
          <Card className="p-6 md:p-8">
            {submittedId ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Inquiry Submitted!</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Thank you for reaching out. Your request ID is{' '}
                  <code className="text-amber-400 font-mono">{submittedId.slice(0, 8)}</code>.
                  I&apos;ll review your project brief and reply shortly.
                </p>
                <Button variant="secondary" onClick={() => setSubmittedId(null)}>
                  Send Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white">Start a Project</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Tell me about what you&apos;re building and your timeline.
                  </p>
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
                    <label htmlFor="project-type" className="text-sm font-medium text-gray-300">
                      Project Type *
                    </label>
                    <select
                      id="project-type"
                      value={form.project_type}
                      onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                      className="w-full rounded-lg border border-[#333] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/70"
                    >
                      {HIRE_SERVICES.map((s) => (
                        <option key={s.title} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="budget-range" className="text-sm font-medium text-gray-300">
                      Estimated Budget *
                    </label>
                    <select
                      id="budget-range"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="w-full rounded-lg border border-[#333] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/70"
                    >
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>
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
                  placeholder="Describe your goals, key features, and anything else I should know..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  error={errors.description}
                />

                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  <Send size={16} /> Submit Hire Request
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>US Bank Transfers (FedNow, ACH, Wire via Lead Bank) &amp; Crypto accepted for client invoicing</span>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
