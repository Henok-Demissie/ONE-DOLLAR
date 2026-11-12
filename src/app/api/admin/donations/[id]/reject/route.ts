import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await request.json().catch(() => ({}));
    const reason = body?.reason || 'Rejected by admin';

    // Check donation exists
    const { data: donation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('id, status')
      .eq('id', id)
      .single();

    if (fetchError || !donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    if (donation.status === 'completed') {
      return NextResponse.json({ error: 'Cannot reject a completed donation' }, { status: 409 });
    }

    if (donation.status === 'failed') {
      return NextResponse.json({ error: 'Donation already rejected' }, { status: 409 });
    }

    // Mark as failed
    const { error: updateError } = await supabaseAdmin
      .from('donations')
      .update({ status: 'failed' })
      .eq('id', id);

    if (updateError) throw updateError;

    // Audit log
    try {
      await supabaseAdmin.from('audit_logs').insert({
        action: 'admin_donation_rejected',
        details: {
          donation_id: id,
          admin_email: payload.email,
          reason,
        },
      });
    } catch {
      // Ignore audit log write errors
    }

    return NextResponse.json({ success: true, message: 'Donation rejected' });
  } catch (error) {
    console.error(`[API] /api/admin/donations/${id}/reject error:`, error);
    return NextResponse.json({ error: 'Failed to reject donation' }, { status: 500 });
  }
}
