'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink, Github, Star } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import toast from 'react-hot-toast';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url?: string | null;
  project_url?: string | null;
  live_url?: string | null;
  github_url?: string | null;
  is_featured?: boolean;
  featured?: boolean;
  sort_order?: number;
  display_order?: number;
  created_at: string;
}

interface FormState {
  title: string;
  description: string;
  tech_stack: string;
  image_url: string;
  project_url: string;
  github_url: string;
  is_featured: boolean;
  sort_order: number;
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  tech_stack: '',
  image_url: '',
  project_url: '',
  github_url: '',
  is_featured: false,
  sort_order: 0,
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects ?? []);
      } else {
        toast.error('Failed to load portfolio projects');
      }
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (project: PortfolioProject) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tech_stack: (project.tech_stack ?? []).join(', '),
      image_url: project.image_url ?? '',
      project_url: project.project_url ?? project.live_url ?? '',
      github_url: project.github_url ?? '',
      is_featured: Boolean(project.is_featured ?? project.featured),
      sort_order: project.sort_order ?? project.display_order ?? 0,
    });
    setModalOpen(true);
  };

  const handleDelete = async (project: PortfolioProject) => {
    if (!confirm(`Delete "${project.title}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${project.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech_stack: form.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image_url: form.image_url.trim(),
      project_url: form.project_url.trim(),
      github_url: form.github_url.trim(),
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
    };

    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : '/api/admin/portfolio';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to save project');
      }

      toast.success(editingId ? 'Project updated' : 'Project added');
      setModalOpen(false);
      fetchProjects();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<PortfolioProject>[] = [
    {
      key: 'sort_order',
      label: 'Order',
      sortable: true,
      render: (_v, row) => (
        <span className="text-white/50 text-xs font-mono">
          {row.sort_order ?? row.display_order ?? 0}
        </span>
      ),
    },
    {
      key: 'title',
      label: 'Project',
      sortable: true,
      render: (v, row) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{String(v)}</span>
            {(row.is_featured ?? row.featured) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold-500/15 text-gold-400 border border-gold-500/20">
                <Star size={10} />
                Featured
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 line-clamp-1 max-w-md mt-0.5">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'tech_stack',
      label: 'Tech Stack',
      render: (v) => {
        const list = Array.isArray(v) ? v : [];
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {list.slice(0, 4).map((tech) => (
              <span
                key={String(tech)}
                className="px-2 py-0.5 text-xs rounded bg-white/5 text-white/70 border border-white/10"
              >
                {String(tech)}
              </span>
            ))}
            {list.length > 4 && (
              <span className="text-xs text-white/40">+{list.length - 4}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'project_url',
      label: 'Links',
      render: (_v, row) => {
        const live = row.project_url ?? row.live_url;
        return (
          <div className="flex items-center gap-2">
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-white/5 text-white/60 hover:text-gold-400 transition-colors"
                title="Project URL"
              >
                <ExternalLink size={13} />
              </a>
            )}
            {row.github_url && (
              <a
                href={row.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-white/5 text-white/60 hover:text-white transition-colors"
                title="GitHub URL"
              >
                <Github size={13} />
              </a>
            )}
          </div>
        );
      },
    },
    {
      key: 'id',
      label: 'Actions',
      render: (_v, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-white/40 text-sm mt-1">
            Manage featured projects shown on the public portfolio section
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        keyField="id"
        pageSize={10}
        emptyMessage="No portfolio projects yet. Click Add New Project to create one."
      />

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="E.g. AI Analytics SaaS"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short overview of the project and impact…"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.tech_stack}
                  onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Supabase"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://example.com/preview.png"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={form.project_url}
                    onChange={(e) => setForm({ ...form, project_url: e.target.value })}
                    placeholder="https://project.com"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-1">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <label className="flex items-center gap-2.5 pt-6 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-gold-500 focus:ring-gold-500/40"
                  />
                  <span className="text-sm text-white/80">Featured project</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
