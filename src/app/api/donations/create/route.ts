import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getWalletAddress } from '@/lib/crypto-info';
import { getRateLimit, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';

const VALID_AMOUNTS = [1, 2, 5, 10, 20, 50, 100];

const createDonationSchema = z.object({
  amount_usd: z
    .number()
    .min(1, 'Minimum donation is $1')
    .max(10000, 'Maximum donation is $10,000')
    .refine(
      (val) => VALID_AMOUNTS.includes(val) || (val >= 1 && val <= 10000),
      'Invalid donation amount'
    ),
  currency: z.string().min(1, 'Currency is required'),
  network: z.string().min(1, 'Network is required'),
  donor_name: z.string().max(100).optional().nullable(),
  donor_email: z.string().email().optional().or(z.literal('')).nullable(),
  donor_message: z.string().max(500).optional().nullable(),
  is_anonymous: z.boolean().optional().default(false),
});

function resolveWalletKey(currency: string, network: string): string {
  const upperCurrency = currency.toUpperCase().trim();
  const upperNetwork = network.toUpperCase().trim();

  if (upperCurrency === 'USDT-BEP20' || upperCurrency === 'USDT_BEP20') return 'USDT_BEP20';
  if (upperCurrency === 'USDT-TRC20' || upperCurrency === 'USDT_TRC20') return 'USDT_TRC20';
  if (upperCurrency === 'USDT-ERC20' || upperCurrency === 'USDT_ERC20') return 'USDT_ERC20';
  if (upperCurrency === 'USDT') {
    if (upperNetwork.includes('BEP') || upperNetwork.includes('BSC')) return 'USDT_BEP20';
    if (upperNetwork.includes('TRC')) return 'USDT_TRC20';
    if (upperNetwork.includes('ERC') || upperNetwork.includes('ETH')) return 'USDT_ERC20';
    return `USDT_${upperNetwork.replace(/[^A-Z0-9]/g, '')}`;
  }
  return upperCurrency;
}

export async function POST(request: NextRequest) {
  // Rate limiting: max 10 requests per IP per hour
  const ip = getClientIp(request);
  const rateLimitResult = getRateLimit(ip, 'donations/create', 10);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validation = createDonationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { amount_usd, currency, network, donor_name, donor_email, donor_message, is_anonymous } =
      validation.data;

    const isBankTransfer = currency.toUpperCase() === 'USD_ACH' || network.toUpperCase().includes('ACH');
    const bankAccountNumber = process.env.NEXT_PUBLIC_US_BANK_ACCOUNT || '210717574961';

    let walletKey = resolveWalletKey(currency, network);
    let walletAddress = isBankTransfer ? `LEAD_BANK_${bankAccountNumber}` : getWalletAddress(walletKey);

    if (!walletAddress) {
      return NextResponse.json(
        { error: `Wallet not configured for ${currency} on ${network}. Please contact support.` },
        { status: 400 }
      );
    }

    // Create donation record (donor_name & donor_email are NOT NULL in schema.sql)
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        donor_name: is_anonymous ? 'Anonymous' : donor_name?.trim() || 'Anonymous',
        donor_email: donor_email?.trim() || '',
        donor_message: donor_message?.trim() || null,
        amount_usd,
        currency,
        network,
        wallet_address: walletAddress,
        status: 'pending',
        is_anonymous: is_anonymous ?? false,
      })
      .select('id')
      .single();

    if (donationError) throw donationError;

    // Create payment_sessions record with 30-minute expiry
    const session_token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: sessionError } = await supabaseAdmin.from('payment_sessions').insert({
      donation_id: donation.id,
      session_token,
      payment_method: walletKey,
      payment_data: {
        status: 'pending',
        currency,
        network,
        amount_usd,
        wallet_address: walletAddress,
      },
      expires_at,
    });

    if (sessionError) throw sessionError;

    return NextResponse.json(
      {
        session_token,
        wallet_address: walletAddress,
        network,
        currency,
        amount_usd,
        expires_at,
        donation_id: donation.id,
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error('[API] /api/donations/create error:', error);
    return NextResponse.json({ error: 'Failed to create donation' }, { status: 500 });
  }
}
