// ─── Donation amounts (USD) ──────────────────────────────────────────────────
export const DONATION_AMOUNTS = [1, 2, 5, 10, 20, 50, 100];

// ─── Site configuration ───────────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: 'One Dollar Project',
  builderName: 'Henok Demissie',
  builderTitle: 'Software Engineer & ML / Systems Engineer',
  builderLocation: 'Addis Ababa, Ethiopia',
  builderEmail: 'henokdemissie13@gmail.com',
  resumeUrl: '/Henok_Demissie_Resume.pdf',
  slogan: 'ONE DOLLAR. ONE DREAM. MILLIONS OF POSSIBILITIES.',
  goal: 1_000_000,
  description:
    'From $0 to a million-dollar dream. A transparent journey by Ethiopian software engineer Henok Demissie (Anthropic via Revelo, YC Afterquery, Codeforces Top 5%) proving talent has no borders.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  twitter: '@onedollarproject',
};

// ─── Crypto wallets ───────────────────────────────────────────────────────────
export const CRYPTO_WALLETS = {
  BTC: process.env.NEXT_PUBLIC_BTC_WALLET ?? '',
  ETH: process.env.NEXT_PUBLIC_ETH_WALLET ?? '',
  USDT_BEP20: process.env.NEXT_PUBLIC_USDT_BEP20_WALLET ?? '',
  USDT_TRC20: process.env.NEXT_PUBLIC_USDT_TRC20_WALLET ?? '',
  USDT_ERC20: process.env.NEXT_PUBLIC_USDT_ERC20_WALLET ?? '',
  BNB: process.env.NEXT_PUBLIC_BNB_WALLET ?? '',
};

// ─── Supported cryptocurrencies ───────────────────────────────────────────────
export const SUPPORTED_CRYPTOS = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Network',
    icon: '₿',
    color: '#F7931A',
    wallet: CRYPTO_WALLETS.BTC,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum (ERC-20)',
    icon: 'Ξ',
    color: '#627EEA',
    wallet: CRYPTO_WALLETS.ETH,
  },
  {
    name: 'USDT',
    symbol: 'USDT-BEP20',
    network: 'BNB Smart Chain (BEP-20)',
    icon: '₮',
    color: '#F3BA2F',
    wallet: CRYPTO_WALLETS.USDT_BEP20,
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    network: 'Tron (TRC-20)',
    icon: '₮',
    color: '#26A17B',
    wallet: CRYPTO_WALLETS.USDT_TRC20,
  },
  {
    name: 'USDT',
    symbol: 'USDT-ERC20',
    network: 'Ethereum (ERC-20)',
    icon: '₮',
    color: '#26A17B',
    wallet: CRYPTO_WALLETS.USDT_ERC20,
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    network: 'BNB Smart Chain',
    icon: 'B',
    color: '#F3BA2F',
    wallet: CRYPTO_WALLETS.BNB,
  },
];

// ─── US Bank Transfer Details (Grey / Lead Bank) ──────────────────────────────
export const BANK_TRANSFER_DETAILS = {
  accountHolder: process.env.NEXT_PUBLIC_US_BANK_HOLDER ?? 'Henok Demissie Dale',
  bankName: process.env.NEXT_PUBLIC_US_BANK_NAME ?? 'Lead Bank',
  accountNumber: process.env.NEXT_PUBLIC_US_BANK_ACCOUNT ?? '210717574961',
  routingNumber: process.env.NEXT_PUBLIC_US_BANK_ROUTING ?? '101019644',
  accountType: 'Checking',
  supportedMethods: ['FedNow (Instant 24/7)', 'ACH Transfer', 'Domestic Wire'],
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    description:
      'End-to-end web applications built with Next.js, React, Node.js, and modern databases. From MVP to production-ready.',
    icon: 'Code2',
    price: 'From $500',
  },
  {
    id: 'api-dev',
    title: 'API Development & Integration',
    description:
      'RESTful and GraphQL APIs, third-party integrations, payment gateways, and webhook systems.',
    icon: 'Zap',
    price: 'From $300',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design & Implementation',
    description:
      'Pixel-perfect, responsive interfaces with premium animations and exceptional user experiences.',
    icon: 'Layers',
    price: 'From $400',
  },
  {
    id: 'crypto-dev',
    title: 'Crypto & Web3 Development',
    description:
      'Smart contracts, DApp development, wallet integrations, and crypto payment gateways.',
    icon: 'Coins',
    price: 'From $800',
  },
  {
    id: 'saas',
    title: 'SaaS Platform Development',
    description:
      'Complete SaaS products with multi-tenancy, subscriptions, analytics dashboards, and admin panels.',
    icon: 'LayoutDashboard',
    price: 'From $1,500',
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description:
      'Architecture reviews, code audits, performance optimisations, and technology strategy advice.',
    icon: 'MessageSquare',
    price: 'From $150/hr',
  },
  {
    id: 'automation',
    title: 'Automation & Bot Development',
    description:
      'Workflow automation, web scrapers, Telegram/Discord bots, and scheduled data pipelines.',
    icon: 'Bot',
    price: 'From $250',
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description:
      'Ongoing support, bug fixes, security patches, performance monitoring, and feature additions.',
    icon: 'Shield',
    price: 'From $200/mo',
  },
];

// ─── Skills & Proficiencies (from Henok Demissie Resume) ──────────────────────
export const SKILLS = [
  { name: 'Python & FastAPI', level: 98, category: 'Backend & ML' },
  { name: 'Distributed Systems & Raft', level: 92, category: 'Architecture' },
  { name: 'LLM Prompting & RAG', level: 95, category: 'AI & ML' },
  { name: 'C++ & Algorithmic Problem Solving', level: 96, category: 'Core & Systems' },
  { name: 'Next.js 14 & React', level: 95, category: 'Frontend' },
  { name: 'Redis & SimHash Caching', level: 94, category: 'Performance' },
  { name: 'PostgreSQL & SQL', level: 90, category: 'Database' },
  { name: 'AWS & Cloud Pipelines', level: 88, category: 'Cloud & DevOps' },
  { name: 'Docker & Microservices', level: 90, category: 'DevOps' },
  { name: 'Vector Search (FAISS, Pinecone)', level: 92, category: 'AI & ML' },
  { name: 'PyTorch & Hugging Face', level: 86, category: 'AI & ML' },
  { name: 'TypeScript & Node.js', level: 90, category: 'Full-Stack' },
];
