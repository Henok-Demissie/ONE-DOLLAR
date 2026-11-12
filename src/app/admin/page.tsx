import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const ADMIN_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
);

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    await jwtVerify(token, ADMIN_SECRET, { algorithms: ['HS256'] });
  } catch {
    redirect('/admin/login');
  }

  redirect('/admin/dashboard');
}
