import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const per_page = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '20', 10)));
    const offset = (page - 1) * per_page;

    // Count total public supporters
    const { count, error: countError } = await supabaseAdmin
      .from('donations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .eq('is_anonymous', false);

    if (countError) throw countError;

    // Fetch paginated supporters
    const { data: supporters, error } = await supabaseAdmin
      .from('donations')
      .select('id, donor_name, donor_message, amount_usd, currency, created_at')
      .eq('status', 'completed')
      .eq('is_anonymous', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + per_page - 1);

    if (error) throw error;

    return NextResponse.json({
      supporters: supporters ?? [],
      total: count ?? 0,
      page,
      per_page,
    });
  } catch (error) {
    console.error('[API] /api/public/supporters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch supporters' },
      { status: 500 }
    );
  }
}
