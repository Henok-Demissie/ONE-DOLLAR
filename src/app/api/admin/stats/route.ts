import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { SITE_CONFIG } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: donations, error: donationError } = await supabaseAdmin
      .from('donations')
      .select('id, amount_usd, currency, status, donor_name, created_at');

    if (donationError) throw donationError;

    const total_donations = donations?.length ?? 0;
    const completed = donations?.filter((d) => d.status === 'completed') ?? [];
    const pending = donations?.filter((d) => d.status === 'pending') ?? [];
    const failed = donations?.filter((d) => d.status === 'failed') ?? [];
    const expired = donations?.filter((d) => d.status === 'expired') ?? [];

    const total_raised_usd = completed.reduce(
      (sum, d) => sum + (Number(d.amount_usd) || 0),
      0
    );
    const roundedRaised = Math.round(total_raised_usd * 100) / 100;
    const supporter_count = completed.length;
    const goal_amount = SITE_CONFIG.goal || 1000000;

    // Recent 10 transactions
    const { data: recent_transactions, error: recentError } = await supabaseAdmin
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    // Hire request count
    const { count: hire_request_count, error: hireError } = await supabaseAdmin
      .from('hire_requests')
      .select('*', { count: 'exact', head: true });

    if (hireError) throw hireError;

    return NextResponse.json({
      total_donations,
      total_raised_usd: roundedRaised,
      supporter_count,
      goal_amount,
      progress_percentage: Math.min(100, (roundedRaised / goal_amount) * 100),
      status_counts: {
        completed: completed.length,
        pending: pending.length,
        failed: failed.length,
        expired: expired.length,
      },
      recent_transactions: recent_transactions ?? [],
      hire_request_count: hire_request_count ?? 0,
      // Dashboard UI aliases
      total_raised: roundedRaised,
      supporters: supporter_count,
      pending_verifications: pending.length,
      hire_requests: hire_request_count ?? 0,
      goal: goal_amount,
    });
  } catch (error) {
    console.error('[API] /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
