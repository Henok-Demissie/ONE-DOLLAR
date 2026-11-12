// Simple in-memory rate limiter (IP-based)
// Note: In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_REQUESTS = 10;

// Cleanup old entries every 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);
if (typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

export function getRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, entry);
  }

  entry.count += 1;

  const remaining = Math.max(0, maxRequests - entry.count);
  const allowed = entry.count <= maxRequests;

  return { allowed, remaining, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
