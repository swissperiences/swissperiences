# Security Features

## Implemented Protections

### 1. ✅ Rate Limiting
- **Waitlist:** 5 requests per 10 minutes per email
- **Corporate Inquiries:** 3 requests per 10 minutes per email
- Powered by Upstash Redis (serverless, free tier)

### 2. ✅ Honeypot Fields
- Invisible fields that trap bots
- Implemented in both waitlist and corporate forms
- Silently rejects bot submissions

### 3. ✅ Input Validation
- Email validation using Zod schema
- Frontend and database-level validation
- SQL injection protection via Supabase prepared statements

### 4. ✅ Environment Variables
- All secrets stored in `.env` (gitignored)
- Example file provided in `.env.example`
- Never committed to Git

### 5. ✅ XSS Protection
- React auto-escapes all strings
- No dangerous innerHTML usage in custom code
- Safe dangerouslySetInnerHTML only in shadcn/ui components

### 6. ✅ HTTPS/SSL
- Enforced by Vercel automatically
- All traffic encrypted

---

## Setup Instructions

### Upstash Redis (Rate Limiting)

1. Create free account at https://upstash.com
2. Create a new Redis database (Global for best latency)
3. Copy **REST URL** and **REST TOKEN**
4. Add to Vercel environment variables:
   ```
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token_here
   ```

### Environment Variables Checklist

Add these to Vercel (Settings → Environment Variables):

- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ `RESEND_API_KEY`
- ✅ `UPSTASH_REDIS_REST_URL`
- ✅ `UPSTASH_REDIS_REST_TOKEN`

---

## Known Vulnerabilities

### esbuild (Moderate - Development Only)
- **Severity:** Moderate
- **Impact:** Development server only (NOT production)
- **Risk:** Low (doesn't affect deployed site)
- **Status:** Monitoring, will update when Vite releases compatible version

---

## Future Improvements (Optional)

### Priority 2 (Before Launch)
- [ ] Add Sentry for error monitoring
- [ ] Backend validation (API route with Zod)
- [ ] CAPTCHA (if spam increases)

### Priority 3 (Post-Launch)
- [ ] CSRF tokens
- [ ] Content Security Policy headers
- [ ] Helmet.js for additional headers

---

## Reporting Security Issues

Please report security vulnerabilities to: **hello@swissperiences.ch**

Do not create public GitHub issues for security concerns.
