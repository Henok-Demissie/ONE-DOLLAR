import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  getNowPaymentsPaymentStatus,
  isNowPaymentsIpnConfigured,
  verifyNowPaymentsSignature,
} from '@/lib/nowpayments';

export async function POST(request: NextRequest) {
  if (!isNowPaymentsIpnConfigured()) {
    return NextResponse.json({ error: 'IPN secret not configured' }, { status: 503 });
  }

  try {
    const signature = request.headers.get('x-nowpayments-sig') || '';
    const payload = await request.json();

    if (!verifyNowPaymentsSignature(payload, signature)) {
      await supabaseAdmin.from('audit_logs').insert({
        action: 'nowpayments_ipn_invalid_sig',
        details: { order_id: payload?.order_id ?? null, payment_id: payload?.payment_id ?? null },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const orderId = String(payload.order_id || '');
    const paymentId = payload.payment_id ? String(payload.payment_id) : '';
    const paymentStatus = String(payload.payment_status || '').toLowerCase();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const { data: existingDonation } = await supabaseAdmin
      .from('donations')
      .select('id, status, amount_usd, tx_hash')
      .eq('id', orderId)
      .single();

    if (!existingDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Idempotency guard: already finalized
    if (existingDonation.status === 'completed') {
      return NextResponse.json({ status: 'already_completed' });
    }

    const txRef = payload.payin_hash || (paymentId ? `nowpay_${paymentId}` : null);

    // Double-check payment status directly with NOWPayments API when payment_id is present
    let verifiedStatus = paymentStatus;
    if (paymentId && (paymentStatus === 'finished' || paymentStatus === 'confirmed')) {
      try {
        const remote = await getNowPaymentsPaymentStatus(paymentId);
        if (remote?.payment_status) {
          verifiedStatus = String(remote.payment_status).toLowerCase();
        }
      } catch (err) {
        console.error('[Webhook] NOWPayments verification fallback warning:', err);
      }
    }

    if (verifiedStatus === 'finished') {
      await supabaseAdmin
        .from('donations')
        .update({
          status: 'completed',
          tx_hash: existingDonation.tx_hash || txRef,
          verified_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    } else if (verifiedStatus === 'failed' || verifiedStatus === 'refunded') {
      await supabaseAdmin
        .from('donations')
        .update({
          status: 'failed',
          tx_hash: existingDonation.tx_hash || txRef,
        })
        .eq('id', orderId);
    } else if (verifiedStatus === 'expired') {
      await supabaseAdmin
        .from('donations')
        .update({
          status: 'expired',
          tx_hash: existingDonation.tx_hash || txRef,
        })
        .eq('id', orderId);
    }

    await supabaseAdmin.from('audit_logs').insert({
      action: 'nowpayments_ipn_processed',
      details: {
        order_id: orderId,
        payment_id: paymentId,
        payment_status: verifiedStatus,
        pay_currency: payload.pay_currency ?? null,
        actually_paid: payload.actually_paid ?? null,
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Webhook] /api/webhooks/nowpayments error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

