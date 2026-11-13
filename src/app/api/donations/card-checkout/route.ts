import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getWalletAddress } from '@/lib/crypto-info';
import { getRateLimit, getClientIp } from '@/lib/rate-limit';
import { createNowPaymentsInvoice, isNowPaymentsConfigured } from '@/lib/nowpayments';

const cardCheckoutSchema = z.object({
  amount_usd: z
    .number()
    .min(3, 'Card-to-crypto on-ramp requires a minimum of $3 USD due to processor minimums.')
    .max(10000, 'Maximum donation is $10,000'),
  donor_name: z.string().max(100).optional().nullable(),
  donor_email: z.string().email().optional().or(z.literal('')).nullable(),
  donor_message: z.string().max(500).optional().nullable(),
  is_anonymous: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = getRateLimit(ip, 'donations/card-checkout', 10);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  if (!isNowPaymentsConfigured()) {
    return NextResponse.json(
      {
        error:
          'Card-to-Crypto On-Ramp is not active yet. Add NOWPAYMENTS_API_KEY and NOWPAYMENTS_IPN_SECRET to .env.local to enable card payments.',
        code: 'NOWPAYMENTS_NOT_CONFIGURED',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const validation = cardCheckoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { amount_usd, donor_name, donor_email, donor_message, is_anonymous } = validation.data;
    const settlementWallet =
      getWalletAddress('USDT_BEP20') || getWalletAddress('USDT_TRC20') || '0x84eafb95bb7bfb8d61e00d720e4a3b56c6d09d90';
    const settlementNetwork = getWalletAddress('USDT_BEP20') ? 'BEP20' : 'TRC20';

    let donationId = crypto.randomUUID();
    try {
      const { data: donation, error: donationError } = await supabaseAdmin
        .from('donations')
        .insert({
          donor_name: is_anonymous ? 'Anonymous' : donor_name?.trim() || 'Anonymous',
          donor_email: donor_email?.trim() || '',
          donor_message: donor_message?.trim() || null,
          amount_usd,
          currency: 'USD_CARD',
          network: `NOWPAYMENTS_${settlementNetwork}`,
          wallet_address: settlementWallet,
          status: 'pending',
          is_anonymous: is_anonymous ?? false,
        })
        .select('id')
        .single();

      if (!donationError && donation?.id) {
        donationId = donation.id;
      }
    } catch (dbErr) {
      console.warn('[Card Checkout] Supabase bypass, proceeding with generated donationId:', dbErr);
    }

    const session_token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://one-dollar-psi.vercel.app').replace(/\/$/, '');

    const invoice = await createNowPaymentsInvoice({
      amountUsd: amount_usd,
      orderId: donationId,
      orderDescription: `One Dollar Project Support ($${amount_usd})`,
      ipnCallbackUrl: `${siteUrl}/api/webhooks/nowpayments`,
      successUrl: `${siteUrl}/success?amount=${amount_usd}&currency=USD%20(Card)&tx=${encodeURIComponent(donationId)}`,
      cancelUrl: `${siteUrl}/#donate`,
    });

    try {
      await supabaseAdmin.from('payment_sessions').insert({
        donation_id: donationId,
        session_token,
        payment_method: 'NOWPAYMENTS_ONRAMP',
        payment_data: {
          status: 'pending',
          invoice_id: invoice.id,
          invoice_url: invoice.invoice_url,
          amount_usd,
          settlement_network: settlementNetwork,
        },
        expires_at,
      });
    } catch (dbErr) {
      console.warn('[Card Checkout] Session logging skipped:', dbErr);
    }

    return NextResponse.json({
      session_token,
      donation_id: donationId,
      invoice_id: invoice.id,
      invoice_url: invoice.invoice_url,
      expires_at,
    });
  } catch (error) {
    console.error('[API] /api/donations/card-checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create card checkout invoice' },
      { status: 500 }
    );
  }
}

