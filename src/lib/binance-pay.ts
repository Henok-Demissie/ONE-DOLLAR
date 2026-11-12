// BINANCE PAY MERCHANT INTEGRATION
// STATUS: TODO / NOT WIRED UP YET — Requires approved Binance merchant account
// Apply at: https://merchant.binance.com/
// Docs: https://developers.binance.com/docs/binance-pay/introduction
//
// When approved, wire this into src/app/api/donations/create/route.ts

import crypto from 'crypto';

const MERCHANT_ID = process.env.BINANCE_PAY_MERCHANT_ID;
const API_KEY = process.env.BINANCE_PAY_API_KEY;
const SECRET_KEY = process.env.BINANCE_PAY_SECRET_KEY;
const BINANCE_PAY_BASE_URL = 'https://bpay.binanceapi.com';

export interface CreateOrderParams {
  merchantTradeNo: string;
  orderAmount: number;
  currency: string;
  goods: {
    goodsType: string;
    goodsCategory: string;
    referenceGoodsId: string;
    goodsName: string;
  };
}

export function generateSignature(payload: string, nonce: string, timestamp: string): string {
  if (!SECRET_KEY) {
    throw new Error('BINANCE_PAY_SECRET_KEY is not configured.');
  }
  const signString = `${timestamp}\n${nonce}\n${payload}\n`;
  return crypto.createHmac('sha512', SECRET_KEY).update(signString).digest('hex').toUpperCase();
}

export async function createPaymentOrder(params: CreateOrderParams) {
  if (!MERCHANT_ID || !API_KEY || !SECRET_KEY) {
    throw new Error('Binance Pay credentials not configured. Apply at https://merchant.binance.com/');
  }

  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = JSON.stringify({ ...params, env: { terminalType: 'WEB' } });
  const signature = generateSignature(payload, nonce, timestamp);

  // TODO: Implement HTTP POST call to `${BINANCE_PAY_BASE_URL}/binancepay/openapi/v2/order`
  // Headers:
  //   'Content-Type': 'application/json'
  //   'BinancePay-Timestamp': timestamp
  //   'BinancePay-Nonce': nonce
  //   'BinancePay-Certificate-SN': API_KEY
  //   'BinancePay-Signature': signature
  // Returns: { prepayId, terminalType, expireTime, qrcodeLink, universalUrl, ... }
  void BINANCE_PAY_BASE_URL;
  void signature;

  throw new Error('Binance Pay createPaymentOrder is not wired up yet. See BINANCE_PAY_INTEGRATION.md.');
}

export async function queryPaymentOrder(prepayId: string) {
  if (!MERCHANT_ID || !API_KEY || !SECRET_KEY) {
    throw new Error('Binance Pay credentials not configured. Apply at https://merchant.binance.com/');
  }

  // TODO: Query payment status from `${BINANCE_PAY_BASE_URL}/binancepay/openapi/v2/order/query`
  void prepayId;
  throw new Error('Binance Pay queryPaymentOrder is not wired up yet. See BINANCE_PAY_INTEGRATION.md.');
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Verify Binance Pay webhook signature using Binance public certificate/headers
  void payload;
  void signature;
  return false;
}
