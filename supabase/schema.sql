-- ============================================================
--  ONE DOLLAR PROJECT — Supabase Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── DONATIONS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name      TEXT NOT NULL,
  donor_email     TEXT NOT NULL,
  donor_message   TEXT,
  amount_usd      NUMERIC(10, 2) NOT NULL CHECK (amount_usd > 0),
  currency        TEXT NOT NULL DEFAULT 'BTC',
  wallet_address  TEXT NOT NULL,
  network         TEXT NOT NULL,
  tx_hash         TEXT UNIQUE,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  is_anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_donations_status      ON donations (status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at  ON donations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_email       ON donations (donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_tx_hash     ON donations (tx_hash) WHERE tx_hash IS NOT NULL;

-- ─── PAYMENT SESSIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id     UUID NOT NULL REFERENCES donations (id) ON DELETE CASCADE,
  session_token   TEXT NOT NULL UNIQUE,
  payment_method  TEXT NOT NULL,
  payment_data    JSONB NOT NULL DEFAULT '{}',
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_sessions_token       ON payment_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_donation_id ON payment_sessions (donation_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_expires_at  ON payment_sessions (expires_at);

-- ─── HIRE REQUESTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hire_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name   TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  project_type  TEXT NOT NULL,
  budget_range  TEXT NOT NULL,
  description   TEXT NOT NULL,
  deadline      TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'reviewed', 'accepted', 'declined')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hire_requests_status     ON hire_requests (status);
CREATE INDEX IF NOT EXISTS idx_hire_requests_created_at ON hire_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hire_requests_email      ON hire_requests (email);

-- ─── PORTFOLIO PROJECTS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  tech_stack   TEXT[] NOT NULL DEFAULT '{}',
  image_url    TEXT,
  project_url  TEXT,
  github_url   TEXT,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_sort       ON portfolio_projects (sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured   ON portfolio_projects (is_featured) WHERE is_featured = TRUE;

-- ─── SERVICES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'Code2',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_services_sort   ON services (sort_order);
CREATE INDEX IF NOT EXISTS idx_services_active ON services (is_active) WHERE is_active = TRUE;

-- ─── SITE CONTENT ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content (key);

-- ─── AUDIT LOGS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action     TEXT NOT NULL,
  details    JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE donations          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_sessions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_requests      ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;

-- Public read access ONLY for non-sensitive display tables
-- (donations, payment_sessions, hire_requests, audit_logs remain private to service_role)
DROP POLICY IF EXISTS "Public read site_content" ON site_content;
CREATE POLICY "Public read site_content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "Public read portfolio_projects" ON portfolio_projects;
CREATE POLICY "Public read portfolio_projects"
  ON portfolio_projects FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "Public read active services" ON services;
CREATE POLICY "Public read active services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- ============================================================
--  SEED DATA
-- ============================================================

-- Site content defaults
INSERT INTO site_content (key, value) VALUES
  ('hero_title',       'ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.'),
  ('hero_subtitle',    'Support my journey with just $1. Every dollar brings the dream closer to reality.'),
  ('about_text',       'I am a passionate full-stack developer building premium digital experiences. Your $1 donation fuels innovation, creativity, and the pursuit of excellence.'),
  ('goal_amount',      '1000000'),
  ('donation_cta',     'Donate $1 Now'),
  ('hire_cta',         'Hire Me'),
  ('contact_email',    'hello@onedollarproject.com'),
  ('twitter_url',      'https://twitter.com/onedollarproject'),
  ('github_url',       'https://github.com/onedollarproject'),
  ('linkedin_url',     'https://linkedin.com/in/onedollarproject')
ON CONFLICT (key) DO NOTHING;

-- Services seed data
INSERT INTO services (title, description, icon, is_active, sort_order) VALUES
  ('Full-Stack Web Development', 'End-to-end web applications built with Next.js, React, Node.js, and modern databases.', 'Code2', TRUE, 1),
  ('API Development & Integration', 'RESTful and GraphQL APIs, third-party integrations, payment gateways, and webhook systems.', 'Zap', TRUE, 2),
  ('UI/UX Design & Implementation', 'Pixel-perfect, responsive interfaces with premium animations and exceptional user experiences.', 'Layers', TRUE, 3),
  ('Crypto & Web3 Development', 'Smart contracts, DApp development, wallet integrations, and crypto payment gateways.', 'Coins', TRUE, 4),
  ('SaaS Platform Development', 'Complete SaaS products with multi-tenancy, subscriptions, analytics dashboards, and admin panels.', 'LayoutDashboard', TRUE, 5),
  ('Technical Consulting', 'Architecture reviews, code audits, performance optimisations, and technology strategy advice.', 'MessageSquare', TRUE, 6),
  ('Automation & Bot Development', 'Workflow automation, web scrapers, Telegram/Discord bots, and scheduled data pipelines.', 'Bot', TRUE, 7),
  ('Maintenance & Support', 'Ongoing support, bug fixes, security patches, performance monitoring, and feature additions.', 'Shield', TRUE, 8)
ON CONFLICT DO NOTHING;
