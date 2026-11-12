import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get completed donations sum and count
    const { data: donationStats, error: donationError } = await supabaseAdmin
      .from('donations')
      .select('amount_usd')
      .eq('status', 'completed');

    if (donationError) throw donationError;

    const total_raised_usd =
      donationStats?.reduce((sum, d) => sum + (Number(d.amount_usd) || 0), 0) ?? 0;

    const supporter_count = donationStats?.length ?? 0;

    // Get configurable goal and project start date from site_content
    const { data: contentRows } = await supabaseAdmin
      .from('site_content')
      .select('key, value')
      .in('key', ['project_start_date', 'goal_amount']);

    const contentMap = (contentRows ?? []).reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    const goal_amount = Number(contentMap.goal_amount) || SITE_CONFIG.goal || 1000000;

    let days_active = 1;
    if (contentMap.project_start_date) {
      const startDate = new Date(contentMap.project_start_date);
      if (!Number.isNaN(startDate.getTime())) {
        const now = new Date();
        days_active = Math.max(
          1,
          Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        );
      }
    }

    const roundedTotal = Math.round(total_raised_usd * 100) / 100;
    const goalProgress = Math.min(100, (roundedTotal / goal_amount) * 100);

    return NextResponse.json({
      total_raised_usd: roundedTotal,
      supporter_count,
      goal_amount,
      days_active,
      // CamelCase aliases for frontend StatsSection compatibility
      totalRaised: roundedTotal,
      totalSupporters: supporter_count,
      goalAmount: goal_amount,
      daysActive: days_active,
      goalProgress: Math.round(goalProgress * 100) / 100,
    });
  } catch (error) {
    console.error('[API] /api/public/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
