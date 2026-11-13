import crypto from 'crypto';

const NOWPAYMENTS_DEFAULT_API_KEY = 'QVTWYVC-905M4Y7-PZX5DE5-QS9Z0K8';
const NOWPAYMENTS_DEFAULT_IPN_SECRET = 'iUHQaOVQptPnLIDULTzSDGbngqjiJhY+';

const NOWPAYMENTS_API_URL =
  process.env.NOWPAYMENTS_SANDBOX === 'true'
    ? 'https://api-sandbox.nowpayments.io/v1'
    : 'https://api.nowpayments.io/v1';

export function getNowPaymentsApiKey(): string {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (apiKey && !apiKey.startsWith('your_') && apiKey.trim().length > 0) {
    return apiKey.trim();
  }
  return NOWPAYMENTS_DEFAULT_API_KEY;
}

export function getNowPaymentsIpnSecret(): string {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (ipnSecret && !ipnSecret.startsWith('your_') && ipnSecret.trim().length > 0) {
    return ipnSecret.trim();
  }
  return NOWPAYMENTS_DEFAULT_IPN_SECRET;
}

export function isNowPaymentsConfigured(): boolean {
  const apiKey = getNowPaymentsApiKey();
  return Boolean(apiKey && !apiKey.startsWith('your_'));
}

export function isNowPaymentsIpnConfigured(): boolean {
  const ipnSecret = getNowPaymentsIpnSecret();
  return Boolean(ipnSecret && !ipnSecret.startsWith('your_'));
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const record = obj as Record<string, unknown>;
    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectKeys(record[key]);
        return acc;
      }, {});
  }
  return obj;
}

/**
 * Verifies the `x-nowpayments-sig` HMAC-SHA512 webhook signature.
 */
export function verifyNowPaymentsSignature(payload: unknown, receivedSignature: string): boolean {
  const ipnSecret = getNowPaymentsIpnSecret();
  if (!ipnSecret || !receivedSignature) return false;

  const sortedJson = JSON.stringify(sortObjectKeys(payload));
  const expectedSignature = crypto
    .createHmac('sha512', ipnSecret)
    .update(sortedJson)
    .digest('hex');

  const a = Buffer.from(expectedSignature, 'utf8');
  const b = Buffer.from(receivedSignature.trim().toLowerCase(), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export interface CreateNowPaymentsInvoiceParams {
  amountUsd: number;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}

export interface NowPaymentsInvoiceResponse {
  id: string;
  token_id?: string;
  order_id: string;
  order_description: string;
  price_amount: string | number;
  price_currency: string;
  pay_currency?: string | null;
  ipn_callback_url?: string;
  invoice_url: string;
  success_url?: string;
  cancel_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Creates a hosted NOWPayments invoice.
 * When Fiat Operations (On-Ramp) is enabled in your NOWPayments Dashboard,
 * donors can pay with Visa/Mastercard and NOWPayments settles to your payout wallet
 * (e.g. USDT BEP-20 or USDT TRC-20).
 */
export async function createNowPaymentsInvoice(
  params: CreateNowPaymentsInvoiceParams
): Promise<NowPaymentsInvoiceResponse> {
  const apiKey = getNowPaymentsApiKey();
  if (!apiKey || apiKey.startsWith('your_')) {
    throw new Error('NOWPAYMENTS_API_KEY is not configured');
  }

  const res = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: params.amountUsd,
      price_currency: 'usd',
      order_id: params.orderId,
      order_description: params.orderDescription,
      ipn_callback_url: params.ipnCallbackUrl,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data?.invoice_url) {
    throw new Error(data?.message || `NOWPayments invoice creation failed (${res.status})`);
  }

  return data as NowPaymentsInvoiceResponse;
}

/**
 * Queries a payment directly from NOWPayments API for server-side verification.
 */
export async function getNowPaymentsPaymentStatus(paymentId: string | number) {
  const apiKey = getNowPaymentsApiKey();
  if (!apiKey || apiKey.startsWith('your_')) {
    throw new Error('NOWPAYMENTS_API_KEY is not configured');
  }

  const res = await fetch(`${NOWPAYMENTS_API_URL}/payment/${encodeURIComponent(String(paymentId))}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`NOWPayments status query failed (${res.status})`);
  }

  return res.json();
}

