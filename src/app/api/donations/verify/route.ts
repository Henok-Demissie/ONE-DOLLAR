import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendDonationConfirmation } from '@/lib/email';

const verifySchema = z.object({
  session_token: z.string().min(1, 'Session token required'),
  tx_hash: z
    .string()
    .trim()
    .min(10, 'Invalid transaction hash')
    .max(200, 'Transaction hash too long')
    .regex(/^(0x)?[a-fA-F0-9]+$/, 'Invalid transaction hash format'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = verifySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { session_token, tx_hash } = validation.data;

    // Check session exists and is not expired
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('payment_sessions')
      .select('*, donations(*)')
      .eq('session_token', session_token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 404 });
    }

    const paymentData = (session.payment_data as Record<string, unknown>) || {};
    const currentSessionStatus = (paymentData.status as string) || 'pending';

    if (new Date(session.expires_at) < new Date()) {
      await supabaseAdmin
        .from('payment_sessions')
        .update({ payment_data: { ...paymentData, status: 'expired' } })
        .eq('session_token', session_token);

      await supabaseAdmin
        .from('donations')
        .update({ status: 'expired' })
        .eq('id', session.donation_id);

      return NextResponse.json({ error: 'Session has expired' }, { status: 410 });
    }

    if (currentSessionStatus !== 'pending') {
      return NextResponse.json({ error: 'Session is no longer active' }, { status: 409 });
    }

    // Check tx_hash not already used (prevent duplicate submissions)
    const { data: existingTx } = await supabaseAdmin
      .from('donations')
      .select('id')
      .eq('tx_hash', tx_hash)
      .maybeSingle();

    if (existingTx) {
      return NextResponse.json(
        { error: 'This transaction hash has already been submitted' },
        { status: 409 }
      );
    }

    // Save tx_hash to donation record (status stays 'pending' — admin must verify)
    const { error: updateError } = await supabaseAdmin
      .from('donations')
      .update({ tx_hash, status: 'pending' })
      .eq('id', session.donation_id);

    if (updateError) throw updateError;

    // Update session payment_data status
    await supabaseAdmin
      .from('payment_sessions')
      .update({
        payment_data: {
          ...paymentData,
          status: 'submitted',
          tx_hash,
          submitted_at: new Date().toISOString(),
        },
      })
      .eq('session_token', session_token);

    // Send confirmation email if donor provided one
    const donation = Array.isArray(session.donations) ? session.donations[0] : session.donations;
    if (donation?.donor_email) {
      await sendDonationConfirmation(
        {
          id: donation.id,
          donor_name: donation.donor_name,
          amount_usd: donation.amount_usd,
          currency: donation.currency,
          network: donation.network,
          created_at: donation.created_at,
        },
        donation.donor_email
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment submitted for verification',
    });
  } catch (error) {
    console.error('[API] /api/donations/verify error:', error);
    return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
  }
}
