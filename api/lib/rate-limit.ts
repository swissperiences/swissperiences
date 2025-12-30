import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows:
// - 5 requests per 10 minutes for waitlist
// - 3 requests per 10 minutes for corporate inquiries
export const waitlistRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
  prefix: '@swissperiences/waitlist',
});

export const corporateRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '10 m'),
  analytics: true,
  prefix: '@swissperiences/corporate',
});

/**
 * Rate limit check helper
 * Returns { success: true } if allowed, { success: false, error: string } if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  type: 'waitlist' | 'corporate'
): Promise<{ success: boolean; error?: string }> {
  const ratelimit = type === 'waitlist' ? waitlistRatelimit : corporateRatelimit;

  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    const resetDate = new Date(reset);
    const minutesUntilReset = Math.ceil((resetDate.getTime() - Date.now()) / 1000 / 60);

    return {
      success: false,
      error: `Too many requests. Please try again in ${minutesUntilReset} minute${minutesUntilReset > 1 ? 's' : ''}.`,
    };
  }

  return { success: true };
}
