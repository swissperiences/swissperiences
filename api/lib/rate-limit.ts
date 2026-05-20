/**
 * Simple in-memory rate limiter for Vercel serverless functions.
 * No external dependencies (no Redis/Upstash needed).
 *
 * Note: Each Vercel function instance has its own memory, so this is
 * per-instance, not global. It still blocks rapid-fire spam from the
 * same IP within a single instance's lifetime (~5-15 min).
 * For a solo-founder site with low traffic, this is sufficient.
 */

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  waitlist:  { max: 5,  windowMs: 10 * 60 * 1000 },  // 5 per 10 min
  corporate: { max: 3,  windowMs: 10 * 60 * 1000 },  // 3 per 10 min
  partner:   { max: 3,  windowMs: 10 * 60 * 1000 },  // 3 per 10 min
  guide:     { max: 5,  windowMs: 60 * 60 * 1000 },   // 5 per hour
};

const store = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  identifier: string,
  type: 'waitlist' | 'corporate' | 'partner' | 'guide'
): Promise<{ success: boolean; error?: string }> {
  const limit = LIMITS[type];
  if (!limit) return { success: true };

  const key = `${type}:${identifier}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + limit.windowMs });
    return { success: true };
  }

  if (entry.count >= limit.max) {
    const minutesLeft = Math.ceil((entry.resetAt - now) / 1000 / 60);
    return {
      success: false,
      error: `Too many requests. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
    };
  }

  entry.count++;
  return { success: true };
}
