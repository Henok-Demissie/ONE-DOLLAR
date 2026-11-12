import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session_token = searchParams.get('session_token');

    if (!session_token) {
      return NextResponse.json({ error: 'session_token is required' }, { status: 400 });
    }

    const { data: session, error } = await supabaseAdmin
      .from('payment_sessions')
      .select(
        `
        id,
        session_token,
        payment_method,
        payment_data,
        expires_at,
        created_at,
        donations (
          id,
          amount_usd,
          currency,
          network,
          wallet_address,
          status,
          tx_hash,
          is_anonymous,
          created_at,
          verified_at
        )
      `
      )
      .eq('session_token', session_token)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const isExpired = new Date(session.expires_at) < new Date();
    const paymentData = (session.payment_data as Record<string, unknown>) || {};
    const sessionStatus = isExpired ? 'expired' : (paymentData.status as string) || 'pending';

    return NextResponse.json({
      session_status: sessionStatus,
      expires_at: session.expires_at,
      is_expired: isExpired,
      donation: Array.isArray(session.donations) ? session.donations[0] : session.donations,
    });
  } catch (error) {
    console.error('[API] /api/donations/status error:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
