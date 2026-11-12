// ─── Donation ─────────────────────────────────────────────────────────────────
export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_message?: string;
  amount_usd: number;
  currency: string;
  wallet_address: string;
  network: string;
  tx_hash?: string;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  is_anonymous: boolean;
  created_at: string;
  verified_at?: string;
}

// ─── Payment Session ──────────────────────────────────────────────────────────
export interface PaymentSession {
  id: string;
  donation_id: string;
  session_token: string;
  payment_method: string;
  payment_data: Record<string, unknown>;
  expires_at: string;
  created_at: string;
}

// ─── Supporter (public-facing donor) ─────────────────────────────────────────
export interface Supporter {
  id: string;
  donor_name: string;
  donor_message?: string;
  amount_usd: number;
  is_anonymous: boolean;
  created_at: string;
}

// ─── Hire Request ─────────────────────────────────────────────────────────────
export interface HireRequest {
  id: string;
  client_name: string;
  email: string;
  company?: string;
  project_type: string;
  budget_range: string;
  description: string;
  deadline?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  admin_notes?: string;
  created_at: string;
}

// ─── Portfolio Project ────────────────────────────────────────────────────────
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url?: string;
  project_url?: string;
  github_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────
export interface AdminStats {
  total_donations: number;
  total_amount_usd: number;
  pending_donations: number;
  completed_donations: number;
  total_hire_requests: number;
  pending_hire_requests: number;
  goal_percentage: number;
}

// ─── Site Content ─────────────────────────────────────────────────────────────
export interface SiteContent {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// ─── Crypto payment ───────────────────────────────────────────────────────────
export interface CryptoInfo {
  name: string;
  symbol: string;
  network: string;
  icon: string;
  color: string;
  wallet: string;
}

// ─── Form payloads ────────────────────────────────────────────────────────────
export interface DonationFormValues {
  amount: number;
  donor_name: string;
  donor_email: string;
  donor_message?: string;
  is_anonymous: boolean;
  currency: string;
}

export interface HireFormValues {
  client_name: string;
  email: string;
  company?: string;
  project_type: string;
  budget_range: string;
  description: string;
  deadline?: string;
}
