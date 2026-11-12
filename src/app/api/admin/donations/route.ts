import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_SORT_COLUMNS = ['created_at', 'amount_usd', 'donor_name', 'status', 'currency'];

export async function GET(request: NextRequest) {
  const payload = verifyAdminToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const rawLimit = searchParams.get('per_page') || searchParams.get('limit') || '20';
    const per_page = Math.min(100, Math.max(1, parseInt(rawLimit, 10)));
    const offset = (page - 1) * per_page;

    const status = searchParams.get('status');
    const currency = searchParams.get('currency');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const sortParam = searchParams.get('sort') || 'created_at';
    const sort = ALLOWED_SORT_COLUMNS.includes(sortParam) ? sortParam : 'created_at';
    const ascending = searchParams.get('dir') === 'asc';

    let query = supabaseAdmin
      .from('donations')
      .select('*', { count: 'exact' })
      .order(sort, { ascending })
      .range(offset, offset + per_page - 1);

    if (status) query = query.eq('status', status);
    if (currency) query = query.eq('currency', currency);
    if (date_from) query = query.gte('created_at', date_from);
    if (date_to) query = query.lte('created_at', date_to);

    const { data: donations, count, error } = await query;

    if (error) throw error;

    const rows = donations ?? [];
    return NextResponse.json({
      donations: rows,
      data: rows,
      total: count ?? 0,
      page,
      per_page,
    });
  } catch (error) {
    console.error('[API] /api/admin/donations error:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
