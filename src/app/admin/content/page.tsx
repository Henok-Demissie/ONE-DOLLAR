'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save, Loader2, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface ContentRow {
  key: string;
  value: string;
  updated_at?: string;
}

const DEFAULT_KEYS: { key: string; label: string; multiline: boolean; description: string }[] = [
  {
    key: 'hero_title',
    label: 'Hero Title',
    multiline: false,
    description: 'Main headline displayed in the hero section',
  },
  {
    key: 'hero_subtitle',
    label: 'Hero Subtitle',
    multiline: true,
    description: 'Supporting copy below the hero headline',
  },
  {
    key: 'about_title',
    label: 'About Title',
    multiline: false,
    description: 'Heading for the About / Story section',
  },
  {
    key: 'about_text',
    label: 'About Text',
    multiline: true,
    description: 'Bio and mission statement in the About section',
  },
  {
    key: 'story_text',
    label: 'Story Text',
    multiline: true,
    description: 'Detailed story behind the One Dollar Project',
  },
  {
    key: 'goal_amount',
    label: 'Goal Amount (USD)',
    multiline: false,
    description: 'Numeric fundraising target (e.g. 1000000)',
  },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [updatedAt, setUpdatedAt] = useState<Record<string, string>>({});
  const [extraKeys, setExtraKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const rows: ContentRow[] = data.rows ?? [];
        const valMap: Record<string, string> = {};
        const timeMap: Record<string, string> = {};
        const knownKeys = new Set(DEFAULT_KEYS.map((k) => k.key));
        const extras: string[] = [];

        rows.forEach((row) => {
          valMap[row.key] = row.value ?? '';
          if (row.updated_at) timeMap[row.key] = row.updated_at;
          if (!knownKeys.has(row.key)) extras.push(row.key);
        });

        setValues(valMap);
        setUpdatedAt(timeMap);
        setExtraKeys(extras);
      } else {
        toast.error('Failed to load site content');
      }
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async (key: string) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: values[key] ?? '' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Failed to save');
      }

      setUpdatedAt((prev) => ({ ...prev, [key]: new Date().toISOString() }));
      toast.success(`Saved "${key}"`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingKey(null);
    }
  };

  const allBlocks = [
    ...DEFAULT_KEYS,
    ...extraKeys.map((key) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      multiline: (values[key]?.length ?? 0) > 80,
      description: 'Custom content block',
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Content</h1>
        <p className="text-white/40 text-sm mt-1">
          Edit dynamic copy and configuration stored in the <code className="text-gold-400">site_content</code> table
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#111111] border border-white/5 rounded-xl p-6 animate-pulse space-y-3"
            >
              <div className="h-4 w-40 bg-white/5 rounded" />
              <div className="h-20 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {allBlocks.map((block) => {
            const isSaving = savingKey === block.key;
            const lastUpdated = updatedAt[block.key];

            return (
              <div
                key={block.key}
                className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-gold-400" />
                      <h2 className="text-sm font-semibold text-white">{block.label}</h2>
                      <span className="text-[11px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                        {block.key}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{block.description}</p>
                  </div>

                  {lastUpdated && (
                    <div className="flex items-center gap-1.5 text-xs text-white/30">
                      <Clock size={12} />
                      <span>Updated {format(new Date(lastUpdated), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  )}
                </div>

                {block.multiline ? (
                  <textarea
                    rows={4}
                    value={values[block.key] ?? ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [block.key]: e.target.value }))
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[block.key] ?? ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [block.key]: e.target.value }))
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-500/50"
                  />
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSave(block.key)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black text-xs font-semibold transition-colors disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Save size={13} />
                    )}
                    {isSaving ? 'Saving…' : 'Save Block'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
