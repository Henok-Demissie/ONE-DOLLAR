# Binance Pay Integration Guide — ONE DOLLAR PROJECT

> **Honest Status:** This document explains what is currently working, what is planned, and exactly what you need to do to enable Binance Pay.

---

## Current Status: Crypto Wallet Donations ✅ ACTIVE

The platform currently uses **direct cryptocurrency wallet donations**. This is the simplest and most reliable method — no merchant account, no KYB verification, no approval process required.

### How it works now:
1. Donor selects amount + crypto currency
2. Platform shows wallet address + QR code
3. Donor sends crypto directly to your wallet
4. Donor submits their transaction hash (TX hash)
5. Admin verifies the TX hash on a blockchain explorer
6. Admin marks donation as `completed`
7. Donor appears on Wall of Supporters

**Supported currencies:** BTC, ETH, USDT (TRC20), USDT (ERC20), BNB

This works immediately with no approval needed. ✅

---

## Binance Pay Merchant: Future Integration 🚧

Binance Pay offers a more seamless experience where donors pay through the Binance app/website with automatic payment confirmation. However, it **requires a Binance merchant account**, which must be applied for and approved by Binance.

### Why Binance Pay Instead of Crypto Wallets?

| Feature | Crypto Wallets (Current) | Binance Pay (Future) |
|---|---|---|
| Setup time | Immediate | Weeks (approval required) |
| Approval required | No | Yes (KYB) |
| Auto-confirmation | No (manual TX verification) | Yes (webhook) |
| Donor experience | Moderate (copy address, send, submit hash) | Smooth (Binance app) |
| Currencies | BTC, ETH, USDT, BNB | 300+ Binance-supported |
| Fees | Network gas only | Binance merchant fees |

---

## To Enable Binance Pay Merchant

Follow these steps **in order**:

### Step 1 — Apply for a Binance Merchant Account

1. Go to https://merchant.binance.com/
2. Click **Apply Now**
3. Sign in with your Binance account (create one if needed)
4. Fill in the merchant application form:
   - Business type (individual or company)
   - Business description (donation platform / freelance services)
   - Website URL
   - Expected monthly volume

### Step 2 — Complete KYB Verification

Binance requires **Know Your Business (KYB)** verification:
- Government-issued ID
- Proof of address
- Business registration (if applicable)
- Website/platform description

Review time: **1–4 weeks** (varies by region and account history)

> ⚠️ **Ethiopian users:** Binance merchant availability varies by region. Check https://merchant.binance.com/ for current supported countries.

### Step 3 — Obtain Credentials

Once approved, in the Binance Merchant Dashboard:
- **Merchant ID** → `BINANCE_PAY_MERCHANT_ID`
- **API Key** → `BINANCE_PAY_API_KEY`
- **Secret Key** → `BINANCE_PAY_SECRET_KEY`

### Step 4 — Configure Environment Variables

Add to `.env.local` and to Vercel environment variables:

```env
BINANCE_PAY_MERCHANT_ID=your_merchant_id_here
BINANCE_PAY_API_KEY=your_api_key_here
BINANCE_PAY_SECRET_KEY=your_secret_key_here
```

### Step 5 — Wire Up the Integration

The integration code is already written and ready in `src/lib/binance-pay.ts`. To activate it:

1. Open `src/app/api/donations/create/route.ts`
2. Import and use `createPaymentOrder` from `src/lib/binance-pay.ts`
3. Add a webhook endpoint at `src/app/api/donations/webhook/route.ts` using `verifyWebhookSignature`
4. Configure the webhook URL in your Binance Merchant Dashboard:
   `https://yourdomain.com/api/donations/webhook`

### API Documentation

- Full API reference: https://developers.binance.com/docs/binance-pay/introduction
- Order creation: `POST /binancepay/openapi/v2/order`
- Order query: `POST /binancepay/openapi/v2/order/query`
- Webhook events: `PAY_SUCCESS`, `PAY_CLOSED`

---

## Integration Code (Ready — Not Yet Wired Up)

The file `src/lib/binance-pay.ts` contains the prepared integration. See it below and at [src/lib/binance-pay.ts](./src/lib/binance-pay.ts).

> **This file is a template.** It is not currently connected to any API route. Wire it up after obtaining merchant credentials.

```typescript
// BINANCE PAY MERCHANT INTEGRATION — TEMPLATE
// Status: Ready to wire up once merchant account is approved
// See BINANCE_PAY_INTEGRATION.md for setup instructions
```

---

## Webhook Security

When you wire up the webhook, **always verify the signature**:

```typescript
// In your webhook route handler:
const isValid = verifyWebhookSignature(rawBody, req.headers['binancepay-signature']);
if (!isValid) {
  return Response.json({ error: 'Invalid signature' }, { status: 401 });
}
```

Never trust a webhook without verifying its signature — this prevents fraudulent payment confirmations.
