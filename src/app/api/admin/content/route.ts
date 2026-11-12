import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const updateContentSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().max(10000),
});

export async function GET(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: content, error } = await supabaseAdmin
      .from('site_content')
      .select('key, value, updated_at')
      .order('key');

    if (error) throw error;

    // Convert to key-value map for convenience
    const contentMap = (content ?? []).reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return NextResponse.json({ content: contentMap, rows: content ?? [] });
  } catch (error) {
    console.error('[API] /api/admin/content GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = updateContentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { key, value } = validation.data;

    // Upsert (insert or update)
    const { error } = await supabaseAdmin.from('site_content').upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, key, value });
  } catch (error) {
    console.error('[API] /api/admin/content PUT error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
