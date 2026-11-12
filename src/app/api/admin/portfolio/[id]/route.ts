import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  tech_stack: z.array(z.string()).optional(),
  image_url: z.string().url().optional().or(z.literal('')).nullable(),
  project_url: z.string().url().optional().or(z.literal('')).nullable(),
  live_url: z.string().url().optional().or(z.literal('')).nullable(),
  github_url: z.string().url().optional().or(z.literal('')).nullable(),
  is_featured: z.boolean().optional(),
  featured: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  display_order: z.number().int().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const d = validation.data;
    const updates: Record<string, unknown> = {};

    if (d.title !== undefined) updates.title = d.title;
    if (d.description !== undefined) updates.description = d.description;
    if (d.tech_stack !== undefined) updates.tech_stack = d.tech_stack;
    if (d.image_url !== undefined) updates.image_url = d.image_url || null;
    if (d.project_url !== undefined || d.live_url !== undefined) {
      updates.project_url = (d.project_url ?? d.live_url) || null;
    }
    if (d.github_url !== undefined) updates.github_url = d.github_url || null;
    if (d.is_featured !== undefined || d.featured !== undefined) {
      updates.is_featured = d.is_featured ?? d.featured;
    }
    if (d.sort_order !== undefined || d.display_order !== undefined) {
      updates.sort_order = d.sort_order ?? d.display_order;
    }

    const { data: project, error } = await supabaseAdmin
      .from('portfolio_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error(`[API] /api/admin/portfolio/${id} PUT error:`, error);
    return NextResponse.json({ error: 'Failed to update portfolio project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const { error } = await supabaseAdmin
      .from('portfolio_projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[API] /api/admin/portfolio/${id} DELETE error:`, error);
    return NextResponse.json({ error: 'Failed to delete portfolio project' }, { status: 500 });
  }
}
