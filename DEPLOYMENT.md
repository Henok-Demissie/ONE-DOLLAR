# Deployment Guide — ONE DOLLAR PROJECT

> Complete step-by-step guide to deploying ONE DOLLAR PROJECT to production on Vercel.

---

## Prerequisites

Before deploying, ensure you have:

- [ ] A [GitHub](https://github.com) account
- [ ] A [Vercel](https://vercel.com) account (free tier works)
- [ ] A [Supabase](https://supabase.com) project set up with the schema applied
- [ ] All environment variables ready (see [README.md](./README.md#environment-variables))
- [ ] Your cryptocurrency wallet addresses
- [ ] Admin credentials generated (email + bcrypt hash + JWT secret)

---

## Step 1 — Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
cd one-dollar-project
git init
git add .
git commit -m "feat: initial ONE DOLLAR PROJECT setup"
```

### 1.2 Create a GitHub Repository

1. Go to https://github.com/new
2. Name it `one-dollar-project` (or any name you prefer)
3. Set it to **Private** (recommended — to protect your project structure)
4. Do **not** initialize with README (you already have one)
5. Click **Create repository**

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/one-dollar-project.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Set Up Supabase (Production)

If you've been using a development Supabase project, you may want a separate production project.

### 2.1 Create Production Supabase Project

1. Go to https://app.supabase.com
2. Click **New project**
3. Choose a strong database password (save it somewhere safe)
4. Select a region close to your target audience

### 2.2 Apply the Schema

1. In Supabase dashboard → **SQL Editor**
2. Open `supabase/schema.sql` from your project
3. Paste the entire contents and click **Run**
4. Verify tables are created under **Table Editor**

### 2.3 Get Your API Keys

Navigate to **Settings → API** and note:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` *(keep secret!)*

---

## Step 3 — Deploy to Vercel

### 3.1 Import Your Repository

1. Go to https://vercel.com/new
2. Click **Continue with GitHub** and authorize Vercel
3. Find your `one-dollar-project` repository and click **Import**

### 3.2 Configure Project Settings

Vercel should auto-detect Next.js. Verify:
- **Framework Preset:** Next.js ✅
- **Root Directory:** `.` (default)
- **Build Command:** `next build` (or `pnpm build`)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `pnpm install` (recommended) or `npm install`

### 3.3 Set Environment Variables

This is the most important step. In Vercel's **Environment Variables** section, add each variable:

> **Tip:** You can paste all variables at once using Vercel's bulk import — click "Import from .env" and paste the contents of your `.env.local`.

| Variable | Environment | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | From Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development | Server-only, keep secret |
| `NEXT_PUBLIC_SITE_URL` | Production | Your final domain (e.g., `https://onedollarproject.com`) |
| `ADMIN_EMAIL` | Production, Preview | Your admin email |
| `ADMIN_PASSWORD_HASH` | Production, Preview | Bcrypt hash |
| `JWT_SECRET` | Production, Preview | 32+ random chars |
| `NEXT_PUBLIC_BTC_WALLET` | Production, Preview | Your BTC address |
| `NEXT_PUBLIC_ETH_WALLET` | Production, Preview | Your ETH address |
| `NEXT_PUBLIC_USDT_TRC20_WALLET` | Production, Preview | Your USDT TRC20 address |
| `NEXT_PUBLIC_USDT_ERC20_WALLET` | Production, Preview | Your USDT ERC20 address |
| `NEXT_PUBLIC_BNB_WALLET` | Production, Preview | Your BNB address |
| `SMTP_HOST` | Production | Optional, for email |
| `SMTP_PORT` | Production | Optional |
| `SMTP_USER` | Production | Optional |
| `SMTP_PASS` | Production | Optional |

### 3.4 Deploy

Click **Deploy**. Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the Next.js app
4. Deploy to its global CDN

Your site will be live at `https://your-project-name.vercel.app` in about 1–2 minutes.

---

## Step 4 — Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. In your Vercel project → **Settings → Domains**
2. Click **Add**
3. Enter your domain (e.g., `onedollarproject.com`)
4. Follow the DNS configuration instructions

### 4.2 Configure DNS

**If using Vercel's nameservers (recommended):**
- Change your domain's nameservers to Vercel's (shown in dashboard)

**If using existing DNS (e.g., Cloudflare):**
- Add an `A` record pointing to `76.76.21.21`
- Add a `CNAME` for `www` pointing to `cname.vercel-dns.com`

### 4.3 Update NEXT_PUBLIC_SITE_URL

After your domain is live, update this environment variable:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Then redeploy: **Vercel Dashboard → Deployments → Redeploy**.

---

## Step 5 — Production Checklist

Before going live, verify each item:

### Security
- [ ] `.env.local` is **not** committed to Git (check `.gitignore`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set only in Vercel (not in public repo)
- [ ] `JWT_SECRET` is a long, random string (32+ chars)
- [ ] Admin password hash is set correctly
- [ ] Repository is **private** on GitHub (recommended)

### Database
- [ ] Supabase schema applied successfully
- [ ] RLS policies are active (check in Supabase → Authentication → Policies)
- [ ] Service role key has access (test via admin dashboard)

### Functionality
- [ ] Home page loads correctly
- [ ] Donation flow works (create donation, QR code displays)
- [ ] Admin login works at `/admin`
- [ ] Admin can verify donations
- [ ] Hire Me form submits successfully
- [ ] Wall of Supporters shows completed donations

### SEO & Performance
- [ ] `NEXT_PUBLIC_SITE_URL` is set to your production domain
- [ ] Sitemap accessible at `https://yourdomain.com/sitemap.xml`
- [ ] Robots.txt accessible at `https://yourdomain.com/robots.txt`
- [ ] OG image renders in social previews (test with https://opengraph.xyz)
- [ ] Lighthouse score checked (target: 90+ Performance)

### Crypto Wallets
- [ ] All wallet addresses are correct and belong to you
- [ ] Test with a small amount first before promoting
- [ ] Blockchain explorer links work for each currency

---

## Redeployments

Vercel automatically redeploys on every push to `main`:

```bash
git add .
git commit -m "fix: update wallet address"
git push origin main
```

For manual redeploys: **Vercel Dashboard → Deployments → (latest) → Redeploy**.

---

## Monitoring

- **Vercel Analytics** — Enable in Vercel Dashboard for traffic insights (free tier available)
- **Vercel Logs** — View real-time logs under **Deployments → Functions**
- **Supabase Logs** — View database queries under Supabase Dashboard → Logs

---

## Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Build fails | Missing env var or type error | Check Vercel build logs |
| Admin login fails | Wrong password hash or JWT secret | Regenerate hash, update Vercel env |
| Database errors | Schema not applied or wrong keys | Re-run schema.sql, check Supabase keys |
| Donations not saving | Service role key wrong | Verify `SUPABASE_SERVICE_ROLE_KEY` |
| Sitemap empty | `NEXT_PUBLIC_SITE_URL` not set | Add env var and redeploy |
