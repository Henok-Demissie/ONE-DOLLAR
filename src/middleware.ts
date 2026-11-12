import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow the login page through so admins can authenticate
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie?.value) {
    return redirectToLogin(request);
  }

  try {
    // Verify the JWT stored in the cookie
    await jwtVerify(sessionCookie.value, ADMIN_SECRET, {
      algorithms: ['HS256'],
    });

    return NextResponse.next();
  } catch {
    // Invalid or expired token — clear cookie and redirect
    const response = redirectToLogin(request);
    response.cookies.delete('admin_session');
    return response;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
