import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  tech_stack: z.array(z.string()).default([]),
  image_url: z.string().url().optional().or(z.literal('')).nullable(),
  project_url: z.string().url().optional().or(z.literal('')).nullable(),
  live_url: z.string().url().optional().or(z.literal('')).nullable(),
  github_url: z.string().url().optional().or(z.literal('')).nullable(),
  is_featured: z.boolean().optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  display_order: z.number().int().optional(),
});

export async function GET(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: projects, error } = await supabaseAdmin
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = projects ?? [];
    return NextResponse.json({ projects: rows, data: rows });
  } catch (error) {
    console.error('[API] /api/admin/portfolio GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const d = validation.data;
    const { data: project, error } = await supabaseAdmin
      .from('portfolio_projects')
      .insert({
        title: d.title,
        description: d.description,
        tech_stack: d.tech_stack,
        image_url: d.image_url || null,
        project_url: d.project_url || d.live_url || null,
        github_url: d.github_url || null,
        is_featured: d.is_featured ?? d.featured ?? false,
        sort_order: d.sort_order ?? d.display_order ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error('[API] /api/admin/portfolio POST error:', error);
    return NextResponse.json({ error: 'Failed to create portfolio project' }, { status: 500 });
  }
}
