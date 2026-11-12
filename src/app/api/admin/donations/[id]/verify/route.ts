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
    const txHash = typeof body?.tx_hash === 'string' ? body.tx_hash.trim() : undefined;

    // Check donation exists
    const { data: donation, error: fetchError } = await supabaseAdmin
      .from('donations')
      .select('id, status, amount_usd, currency, donor_name, donor_email, tx_hash')
      .eq('id', id)
      .single();

    if (fetchError || !donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    if (donation.status === 'completed') {
      return NextResponse.json({ error: 'Donation already verified' }, { status: 409 });
    }

    // If a new tx_hash is provided, check it's not used on another donation
    if (txHash && txHash !== donation.tx_hash) {
      const { data: existingTx } = await supabaseAdmin
        .from('donations')
        .select('id')
        .eq('tx_hash', txHash)
        .neq('id', id)
        .maybeSingle();

      if (existingTx) {
        return NextResponse.json(
          { error: 'This transaction hash is already associated with another donation' },
          { status: 409 }
        );
      }
    }

    const updateFields: Record<string, unknown> = {
      status: 'completed',
      verified_at: new Date().toISOString(),
    };
    if (txHash) {
      updateFields.tx_hash = txHash;
    }

    const { error: updateError } = await supabaseAdmin
      .from('donations')
      .update(updateFields)
      .eq('id', id);

    if (updateError) throw updateError;

    // Audit log
    try {
      await supabaseAdmin.from('audit_logs').insert({
        action: 'admin_donation_verified',
        details: {
          donation_id: id,
          admin_email: payload.email,
          amount_usd: donation.amount_usd,
          currency: donation.currency,
          tx_hash: txHash || donation.tx_hash || null,
        },
      });
    } catch {
      // Ignore audit log write errors
    }

    return NextResponse.json({ success: true, message: 'Donation verified successfully' });
  } catch (error) {
    console.error(`[API] /api/admin/donations/${id}/verify error:`, error);
    return NextResponse.json({ error: 'Failed to verify donation' }, { status: 500 });
  }
}
