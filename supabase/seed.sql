-- =============================================================================
-- ONE DOLLAR PROJECT — Seed Data for Development
-- Run this AFTER supabase/schema.sql to populate sample data for testing
-- =============================================================================

-- Portfolio Projects (3 samples)
INSERT INTO portfolio_projects (title, description, tech_stack, image_url, project_url, github_url, is_featured, sort_order) VALUES
(
  'E-Commerce Platform',
  'A full-featured e-commerce platform built with Next.js and Supabase. Features include product management, cart, checkout with Stripe, order tracking, and an admin dashboard.',
  ARRAY['Next.js 14', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS', 'Framer Motion'],
  'https://placehold.co/800x600/1a1a1a/gold?text=E-Commerce+Platform',
  'https://example.com/ecommerce',
  'https://github.com/example/ecommerce',
  TRUE,
  1
),
(
  'AI Content Generator',
  'A SaaS application that uses Google Gemini API to generate SEO-optimized blog posts, product descriptions, and social media content. Includes a subscription system and usage analytics.',
  ARRAY['Next.js', 'TypeScript', 'Google Gemini API', 'PostgreSQL', 'Redis', 'Stripe'],
  'https://placehold.co/800x600/1a1a1a/gold?text=AI+Content+Generator',
  'https://example.com/ai-content',
  'https://github.com/example/ai-content',
  TRUE,
  2
),
(
  'Real-Time Chat App',
  'A WhatsApp-inspired real-time messaging application with rooms, direct messages, file sharing, read receipts, and push notifications using Supabase Realtime.',
  ARRAY['React', 'TypeScript', 'Supabase Realtime', 'Tailwind CSS', 'PWA'],
  'https://placehold.co/800x600/1a1a1a/gold?text=Chat+App',
  'https://example.com/chat-app',
  NULL,
  TRUE,
  3
);

-- Services (3 additional samples matching supabase/schema.sql columns)
INSERT INTO services (title, description, icon, is_active, sort_order) VALUES
(
  'Custom Landing Pages & Portfolios',
  'High-converting, responsive landing pages and personal portfolios crafted with Next.js, Tailwind CSS, and Framer Motion.',
  'Sparkles',
  TRUE,
  9
),
(
  'Database Design & Optimization',
  'PostgreSQL schema design, query optimization, indexing strategy, and Supabase RLS architecture.',
  'Database',
  TRUE,
  10
),
(
  'Cloud Deployment & CI/CD',
  'Production setup on Vercel, environment hardening, custom domain configuration, and automated deployment workflows.',
  'Rocket',
  TRUE,
  11
);

-- Site Content entries (matching supabase/schema.sql key/value columns)
INSERT INTO site_content (key, value) VALUES
  ('hero_headline', 'ONE DOLLAR. ONE DREAM.'),
  ('hero_subheadline', 'MILLIONS OF POSSIBILITIES.'),
  ('hero_description', 'Every dollar fuels a dream. Support a passionate developer building the future, one project at a time. Join believers worldwide.'),
  ('hire_intro', 'Need a skilled developer for your next project? I specialize in modern web development with a focus on performance, scalability, and clean code.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Sample Completed Donations (2 samples for testing Wall of Supporters display)
INSERT INTO donations (
  donor_name, donor_email, donor_message, amount_usd, currency,
  wallet_address, network, tx_hash, status, is_anonymous, verified_at
) VALUES
(
  'Alice W.',
  'alice@example.com',
  'Keep building amazing things! Your work is inspiring. Here is $5 to fuel more awesome projects.',
  5.00,
  'ETH',
  '0xAbCdEf1234567890AbCdEf1234567890AbCdEf12',
  'Ethereum',
  '0xabc123def456789012345678901234567890123456789012345678901234567890',
  'completed',
  FALSE,
  NOW()
),
(
  'Anonymous Supporter',
  'anonymous@example.com',
  'The world needs more dreamers. Keep going!',
  1.00,
  'USDT-TRC20',
  'TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Tron',
  'abc123def456789012345678901234567890123456789012345678901234',
  'completed',
  TRUE,
  NOW()
)
ON CONFLICT (tx_hash) DO NOTHING;

-- Sample Pending Donation (1 sample for admin dashboard verification testing)
INSERT INTO donations (
  donor_name, donor_email, donor_message, amount_usd, currency,
  wallet_address, network, tx_hash, status, is_anonymous
) VALUES
(
  'Bob T.',
  'bob@example.com',
  'Sending some BTC your way! Check the hash and confirm.',
  10.00,
  'BTC',
  'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  'Bitcoin',
  'pending_hash_replace_with_real_tx_hash_for_testing',
  'pending',
  FALSE
)
ON CONFLICT (tx_hash) DO NOTHING;
