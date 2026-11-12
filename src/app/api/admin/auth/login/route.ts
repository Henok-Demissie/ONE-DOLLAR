import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateAdminToken, getAdminCookieOptions } from '@/lib/auth';
import { getRateLimit, getClientIp } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = getRateLimit(ip, 'admin/auth/login', 10);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const { email, password } = validation.data;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error('[Admin Auth] ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured');
      return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
    }

    const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, adminPasswordHash);
    } catch {
      passwordMatch = false;
    }

    // Audit log the attempt (non-fatal if DB unreachable)
    try {
      await supabaseAdmin.from('audit_logs').insert({
        action: 'admin_login_attempt',
        details: {
          email,
          success: emailMatch && passwordMatch,
        },
        ip_address: ip,
      });
    } catch {
      // Ignore audit log write errors
    }

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateAdminToken(email);
    const cookieOptions = getAdminCookieOptions();

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: cookieOptions.name,
      value: token,
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
    });

    return response;
  } catch (error) {
    console.error('[API] /api/admin/auth/login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
