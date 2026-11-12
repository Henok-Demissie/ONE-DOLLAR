import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendHireRequestNotification } from '@/lib/email';

const hireRequestSchema = z.object({
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  project_type: z.string().min(1, 'Project type is required').max(100),
  budget_range: z.string().min(1, 'Budget range is required').max(50),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  deadline: z.string().min(1, 'Deadline is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = hireRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { client_name, email, company, project_type, budget_range, description, deadline } =
      validation.data;

    const { data: hireRequest, error } = await supabaseAdmin
      .from('hire_requests')
      .insert({
        client_name,
        email,
        company: company || null,
        project_type,
        budget_range,
        description,
        deadline,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw error;

    // Send notification email (non-blocking)
    sendHireRequestNotification(hireRequest).catch((err) =>
      console.error('[API] Email notification failed:', err)
    );

    return NextResponse.json({ success: true, id: hireRequest.id }, { status: 201 });
  } catch (error) {
    console.error('[API] /api/hire-requests error:', error);
    return NextResponse.json({ error: 'Failed to submit hire request' }, { status: 500 });
  }
}
