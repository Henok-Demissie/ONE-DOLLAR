import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'accepted', 'declined', 'rejected']),
  notes: z.string().max(1000).optional(),
});

export async function PATCH(
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
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Map 'rejected' to 'declined' to match schema.sql CHECK constraint
    const dbStatus =
      validation.data.status === 'rejected' ? 'declined' : validation.data.status;

    const updates: { status: string; admin_notes?: string } = { status: dbStatus };
    if (validation.data.notes !== undefined) {
      updates.admin_notes = validation.data.notes;
    }

    const { data: updated, error } = await supabaseAdmin
      .from('hire_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updated) {
      return NextResponse.json({ error: 'Hire request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hire_request: updated });
  } catch (error) {
    console.error(`[API] /api/admin/hire-requests/${id} PATCH error:`, error);
    return NextResponse.json({ error: 'Failed to update hire request' }, { status: 500 });
  }
}
