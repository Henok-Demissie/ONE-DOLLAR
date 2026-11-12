import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_SORT_COLUMNS = ['created_at', 'client_name', 'project_type', 'budget_range', 'status'];

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
    const sortParam = searchParams.get('sort') || 'created_at';
    const sort = ALLOWED_SORT_COLUMNS.includes(sortParam) ? sortParam : 'created_at';
    const ascending = searchParams.get('dir') === 'asc';

    let query = supabaseAdmin
      .from('hire_requests')
      .select('*', { count: 'exact' })
      .order(sort, { ascending })
      .range(offset, offset + per_page - 1);

    if (status) query = query.eq('status', status);

    const { data: hire_requests, count, error } = await query;

    if (error) throw error;

    const rows = hire_requests ?? [];
    return NextResponse.json({
      hire_requests: rows,
      data: rows,
      total: count ?? 0,
      page,
      per_page,
    });
  } catch (error) {
    console.error('[API] /api/admin/hire-requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch hire requests' }, { status: 500 });
  }
}
