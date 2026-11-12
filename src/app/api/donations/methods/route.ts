import { NextResponse } from 'next/server';
import { getAvailableCryptos } from '@/lib/crypto-info';
import { isNowPaymentsConfigured } from '@/lib/nowpayments';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    cardOnRampEnabled: isNowPaymentsConfigured(),
    cardOnRampProvider: 'NOWPayments',
    cardOnRampMinUsd: 3,
    availableCryptos: getAvailableCryptos().map((c) => ({
      key: c.key,
      currency: c.currency,
      network: c.network,
      networkLabel: c.networkLabel,
    })),
  });
}

