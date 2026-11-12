# ONE DOLLAR PROJECT

> **ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.**

## Overview

**ONE DOLLAR PROJECT** is a premium donation platform and professional hire-me portfolio built for the modern web. It serves a dual purpose:

1. **Donation Platform** — Accepts cryptocurrency donations from supporters worldwide. Every dollar counts. Donors are celebrated on the public "Wall of Supporters," fostering community and transparency.
2. **Hire Me Portfolio** — Showcases professional services, portfolio projects, skills, and a contact form for potential clients to hire the site owner.

The platform is designed to be visually striking (dark theme with gold accents), mobile-first, and production-ready out of the box.

---

## Features

- 🪙 **Premium Crypto Donation Platform** — Direct wallet-based donations for BTC, ETH, USDT (TRC20 & ERC20), and BNB
- 🏆 **Wall of Supporters** — Public display of all verified donors with their messages
- 💼 **Hire Me Portfolio** — Professional services listing, portfolio projects, and skill showcase
- 📬 **Hire Request Form** — Clients can submit project inquiries directly
- 🔐 **Admin Dashboard** — Secure JWT-authenticated admin panel to verify TX hashes and manage donations
- 🗄️ **Supabase Backend** — PostgreSQL database with Row-Level Security (RLS)
- ⚡ **Next.js 14 App Router** — Server components, server actions, and edge-ready
- 🌙 **Dark/Light Theme** — via `next-themes`
- 📧 **Email Notifications** — Optional SMTP email for hire requests
- 🗺️ **SEO Ready** — Sitemap, robots.txt, Open Graph metadata

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14.2.5 | App Router framework |
| React | ^18 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4.1 | Styling |
| Framer Motion | ^11.0.0 | Animations |
| Lucide React | ^0.400.0 | Icons |
| Supabase JS | ^2.43.0 | Database & Auth client |
| @supabase/ssr | ^0.3.0 | Server-side Supabase |
| next-themes | ^0.3.0 | Theme switching |
| react-hook-form | ^7.52.0 | Form handling |
| zod | ^3.23.0 | Schema validation |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.2 | Admin JWT auth |
| nodemailer | ^6.9.14 | Email sending |
| qrcode.react | ^3.1.0 | Crypto QR codes |
| date-fns | ^3.6.0 | Date formatting |
| axios | ^1.7.0 | HTTP client |
| clsx + tailwind-merge | latest | Utility class merging |

---

## Payment Integration

### Crypto Wallet Donations (Active ✅)

The platform uses **direct cryptocurrency wallet donations** — no payment processor required. The flow is:

1. Donor selects an amount and crypto currency
2. Platform displays the wallet address + QR code
3. Donor sends crypto to the displayed address
4. Donor submits their **transaction hash (TX hash)**
5. Admin verifies the TX hash on the blockchain explorer
6. Admin marks the donation as `completed`
7. Donor appears on the Wall of Supporters

**Supported Cryptocurrencies:**

| Currency | Network | Environment Variable |
|---|---|---|
| Bitcoin | Bitcoin | `NEXT_PUBLIC_BTC_WALLET` |
| Ethereum | Ethereum (ERC20) | `NEXT_PUBLIC_ETH_WALLET` |
| USDT | Tron (TRC20) | `NEXT_PUBLIC_USDT_TRC20_WALLET` |
| USDT | Ethereum (ERC20) | `NEXT_PUBLIC_USDT_ERC20_WALLET` |
| BNB | BSC | `NEXT_PUBLIC_BNB_WALLET` |

> **Note for Ethiopian users:** Review the current regulations on cryptocurrency transactions in Ethiopia before accepting real payments.

### Binance Pay Merchant (Future 🚧)

Binance Pay offers a more seamless payment experience but **requires an approved Binance merchant account**.

- Apply at: https://merchant.binance.com/
- API Docs: https://developers.binance.com/docs/binance-pay/introduction
- The integration code is prepared in `src/lib/binance-pay.ts` (not wired up)
- Configure `BINANCE_PAY_*` env vars once approved

See [BINANCE_PAY_INTEGRATION.md](./BINANCE_PAY_INTEGRATION.md) for full details.

---

## Setup Instructions

### Prerequisites

- **Node.js** 18+ (download at https://nodejs.org)
- **pnpm** (recommended) — `npm install -g pnpm`
- **Supabase account** — https://supabase.com (free tier works)
- **Git** — for version control
- *(Optional)* SMTP email account (Gmail App Password recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/one-dollar-project.git
cd one-dollar-project

# 2. Copy the example env file
cp .env.local.example .env.local

# 3. Fill in your credentials (see Environment Variables section below)
nano .env.local   # or use any text editor

# 4. Install dependencies
pnpm install

# 5. Set up the database (see Database Setup below)

# 6. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Environment Variables

Edit `.env.local` with your real values:

| Variable | Required | Where to Get It | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard → Settings → API | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase Dashboard → Settings → API | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase Dashboard → Settings → API | Secret service role key (server only) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your deployed URL or `http://localhost:3000` | Used for sitemap and OG tags |
| `ADMIN_EMAIL` | ✅ | Your email | Email address for the admin login |
| `ADMIN_PASSWORD_HASH` | ✅ | Generate with bcrypt (see below) | Bcrypt hash of your admin password |
| `JWT_SECRET` | ✅ | Generate randomly (32+ chars) | Secret for signing admin JWTs |
| `NEXT_PUBLIC_BTC_WALLET` | ✅ | Your Bitcoin wallet | BTC donation address |
| `NEXT_PUBLIC_ETH_WALLET` | ✅ | Your Ethereum wallet | ETH donation address |
| `NEXT_PUBLIC_USDT_TRC20_WALLET` | ✅ | Your Tron wallet | USDT-TRC20 donation address |
| `NEXT_PUBLIC_USDT_ERC20_WALLET` | ✅ | Your Ethereum wallet | USDT-ERC20 donation address |
| `NEXT_PUBLIC_BNB_WALLET` | ✅ | Your BSC wallet | BNB donation address |
| `SMTP_HOST` | Optional | Your email provider | SMTP server host |
| `SMTP_PORT` | Optional | Usually `587` | SMTP port |
| `SMTP_USER` | Optional | Your email | SMTP username |
| `SMTP_PASS` | Optional | App password | SMTP password |
| `BINANCE_PAY_MERCHANT_ID` | Future | Binance merchant dashboard | Required for Binance Pay |
| `BINANCE_PAY_API_KEY` | Future | Binance merchant dashboard | Required for Binance Pay |
| `BINANCE_PAY_SECRET_KEY` | Future | Binance merchant dashboard | Required for Binance Pay |

---

### Database Setup

1. **Create a Supabase project** at https://app.supabase.com
2. Go to **SQL Editor** in your Supabase dashboard
3. Open `supabase/schema.sql` from this project
4. Paste the entire contents into the SQL editor and click **Run**
5. *(Optional)* For sample development data, also run `supabase/seed.sql`
6. The schema sets up RLS policies automatically — your data is secure

---

### Admin Account Setup

The admin panel is at `/admin`. To set up your admin credentials:

**Step 1 — Generate a bcrypt password hash:**

```bash
# Using Node.js in the project
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 12, (err, hash) => console.log(hash));"
```

**Step 2 — Add to `.env.local`:**

```env
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD_HASH=$2a$12$...the_hash_you_generated...
```

**Step 3 — Generate a JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add the output as `JWT_SECRET` in `.env.local`.

---

### Crypto Wallet Configuration

Add your personal cryptocurrency wallet addresses to `.env.local`:

```env
NEXT_PUBLIC_BTC_WALLET=bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_ETH_WALLET=0xYourEthereumAddress
NEXT_PUBLIC_USDT_TRC20_WALLET=TYourTronAddress
NEXT_PUBLIC_USDT_ERC20_WALLET=0xYourEthereumAddress
NEXT_PUBLIC_BNB_WALLET=0xYourBSCAddress
```

> ⚠️ **IMPORTANT:** These are public (prefixed `NEXT_PUBLIC_`) because they need to be visible in the browser for QR code generation. They are wallet **receive** addresses only — never expose private keys.

---

## Deployment (Vercel)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete step-by-step guide.

**Quick summary:**

```bash
# Push to GitHub first
git add .
git commit -m "Initial deployment"
git push origin main
```

Then:
1. Go to https://vercel.com and import your GitHub repository
2. Set all environment variables from `.env.local` in Vercel's dashboard
3. Deploy!

---

## Security Notes

- 🔒 **Never commit `.env.local`** — it's in `.gitignore` already
- 🔑 **JWT_SECRET** should be at least 32 random characters
- 🛡️ **SUPABASE_SERVICE_ROLE_KEY** is server-side only — never expose to the browser
- 🌍 **Crypto regulations** — Review Ethiopia's current regulations before accepting real payments
- 🔐 **Admin route** is protected by JWT and blocked from search crawlers via `robots.txt`
- ✅ **RLS policies** are set on all Supabase tables — only service role can bypass them

---

## Legal Disclaimer

> All donations made through ONE DOLLAR PROJECT are **entirely voluntary**. Donors receive no equity, no shares, no guaranteed returns, and no rights to any assets or future revenue. Donations are gifts made in support of the creator's work and dreams. No refunds are offered. By donating, you acknowledge that you are making a free-will contribution with no expectation of financial return.

---

## Contributing

This is a personal project. If you've forked it for your own use, feel free to adapt it to your needs. Attribution appreciated but not required.

---

## License

MIT License.
