// Unit tests for the newsletter-signup handler.
// Run with: node --test supabase/functions/newsletter-signup/handler.test.ts
// (Node 22.6+ with type stripping; no Deno required.)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleSignup, type SignupDeps, type SubscriberRecord } from './handler.ts'

interface FakeCall {
    url: string
    payload: Record<string, unknown>
}

function makeDeps(overrides: {
    existing?: SubscriberRecord | null
    upsertError?: Error
    audienceStatus?: number
    welcomeStatus?: number
    adminStatus?: number
} = {}) {
    const calls: FakeCall[] = []
    const statusWrites: Array<{ status: string; error: string | null; attempts: number }> = []
    const logs: string[] = []
    const errors: string[] = []

    const deps: SignupDeps = {
        db: {
            async getSubscriber() {
                return overrides.existing ?? null
            },
            async upsertSubscriber() {
                if (overrides.upsertError) throw overrides.upsertError
            },
            async setWelcomeStatus(_email, status, error, attempts) {
                statusWrites.push({ status, error, attempts })
            },
        },
        fetchFn: (async (url: string | URL | Request, init?: RequestInit) => {
            const urlStr = String(url)
            const payload = JSON.parse(String(init?.body ?? '{}'))
            calls.push({ url: urlStr, payload })
            let status = 200
            if (urlStr.includes('/audiences/')) {
                status = overrides.audienceStatus ?? 201
            } else if (Array.isArray(payload.to) && payload.to[0] === 'admin@test.ch') {
                status = overrides.adminStatus ?? 200
            } else {
                status = overrides.welcomeStatus ?? 200
            }
            const body = status < 300
                ? { id: 'fake-id' }
                : { statusCode: status, name: 'validation_error', message: 'API key is invalid' }
            return new Response(JSON.stringify(body), { status })
        }) as typeof fetch,
        resendApiKey: 're_FAKE_KEY_SHOULD_NEVER_LEAK',
        audienceId: 'aud-123',
        adminEmail: 'admin@test.ch',
        log: (m) => logs.push(m),
        logError: (m) => errors.push(m),
        delayMs: async () => {},
    }
    return { deps, calls, statusWrites, logs, errors }
}

function welcomeCalls(calls: FakeCall[]) {
    return calls.filter(
        (c) => c.url.endsWith('/emails') && Array.isArray(c.payload.to) && c.payload.to[0] !== 'admin@test.ch',
    )
}

function adminCalls(calls: FakeCall[]) {
    return calls.filter((c) => Array.isArray(c.payload.to) && c.payload.to[0] === 'admin@test.ch')
}

function assertNoInternalLeak(body: Record<string, unknown>) {
    const s = JSON.stringify(body)
    assert.ok(!s.includes('re_FAKE_KEY_SHOULD_NEVER_LEAK'), 'API key leaked to browser')
    assert.ok(!s.includes('API key is invalid'), 'Resend error detail leaked to browser')
    assert.ok(!s.toLowerCase().includes('resend'), 'internal provider name leaked to browser')
}

test('full success: subscribed, welcome sent, status persisted as sent', async () => {
    const { deps, calls, statusWrites } = makeDeps()
    const res = await handleSignup({ email: 'new@example.com' }, deps)

    assert.equal(res.status, 200)
    assert.deepEqual(res.body, {
        success: true,
        subscribed: true,
        welcomeEmailSent: true,
        already_subscribed: false,
    })
    assert.equal(welcomeCalls(calls).length, 1)
    assert.equal(adminCalls(calls).length, 1, 'admin must be notified of a first signup')
    assert.deepEqual(statusWrites, [{ status: 'sent', error: null, attempts: 1 }])
    assertNoInternalLeak(res.body)
})

test('database failure: non-2xx, generic error, no Resend calls', async () => {
    const { deps, calls } = makeDeps({ upsertError: new Error('connection refused to db.internal:5432') })
    const res = await handleSignup({ email: 'new@example.com' }, deps)

    assert.equal(res.status, 500)
    assert.equal(res.body.error, 'Could not save your signup. Please try again.')
    assert.ok(!JSON.stringify(res.body).includes('db.internal'), 'internal db detail leaked')
    assert.equal(calls.length, 0, 'no Resend call should happen when the save fails')
})

test('audience failure: signup still succeeds, welcome still sent, alert logged', async () => {
    const { deps, statusWrites, errors } = makeDeps({ audienceStatus: 401 })
    const res = await handleSignup({ email: 'new@example.com' }, deps)

    assert.equal(res.status, 200)
    assert.equal(res.body.success, true)
    assert.equal(res.body.welcomeEmailSent, true)
    assert.deepEqual(statusWrites, [{ status: 'sent', error: null, attempts: 1 }])
    assert.ok(
        errors.some((e) => e.includes('[ALERT]') && e.includes('audience') && e.includes('401')),
        'audience failure must be logged with operation and status',
    )
    assertNoInternalLeak(res.body)
})

test('welcome email failure after successful signup: partial result, failure persisted for retry', async () => {
    const { deps, statusWrites, errors } = makeDeps({ welcomeStatus: 401 })
    const res = await handleSignup({ email: 'new@example.com' }, deps)

    assert.equal(res.status, 200)
    assert.deepEqual(res.body, {
        success: true,
        subscribed: true,
        welcomeEmailSent: false,
        already_subscribed: false,
    })
    assert.equal(statusWrites.length, 1)
    assert.equal(statusWrites[0].status, 'failed')
    assert.equal(statusWrites[0].attempts, 1)
    assert.ok(statusWrites[0].error?.includes('HTTP 401'), 'persisted error must carry the status')
    assert.ok(
        errors.some((e) => e.includes('[ALERT]') && e.includes('Welcome email') && e.includes('401')),
        'welcome failure must be logged with operation and status',
    )
    assertNoInternalLeak(res.body)
})

test('duplicate email with welcome already sent: idempotent, no resend of welcome', async () => {
    const { deps, calls, statusWrites } = makeDeps({
        existing: { email: 'dup@example.com', welcome_email_status: 'sent', welcome_email_attempts: 1 },
    })
    const res = await handleSignup({ email: 'dup@example.com' }, deps)

    assert.equal(res.status, 200)
    assert.deepEqual(res.body, {
        success: true,
        subscribed: true,
        welcomeEmailSent: true,
        already_subscribed: true,
    })
    assert.equal(calls.length, 0, 'fully-processed duplicate must trigger no Resend call at all')
    assert.equal(statusWrites.length, 0)
})

test('duplicate email after failed welcome: retries the send and increments attempts', async () => {
    const { deps, calls, statusWrites } = makeDeps({
        existing: { email: 'dup@example.com', welcome_email_status: 'failed', welcome_email_attempts: 2 },
    })
    const res = await handleSignup({ email: 'dup@example.com' }, deps)

    assert.equal(res.status, 200)
    assert.equal(res.body.welcomeEmailSent, true)
    assert.equal(res.body.already_subscribed, true)
    assert.equal(welcomeCalls(calls).length, 1, 'failed welcome must be retried')
    assert.equal(adminCalls(calls).length, 0, 'retry must not notify the admin again')
    assert.deepEqual(statusWrites, [{ status: 'sent', error: null, attempts: 3 }])
})

test('logs never contain the raw subscriber address, only the masked form', async () => {
    const { deps, logs, errors } = makeDeps({ welcomeStatus: 401 })
    await handleSignup({ email: 'privacy-test@example.com' }, deps)

    const all = [...logs, ...errors]
    assert.ok(all.length > 0)
    for (const line of all) {
        assert.ok(!line.includes('privacy-test@example.com'), `raw address leaked in log: ${line}`)
    }
    assert.ok(
        all.some((l) => l.includes('pr***@example.com')),
        'masked address must appear in logs',
    )
})

test('invalid email: 400 without touching db or Resend', async () => {
    const { deps, calls } = makeDeps()
    const res = await handleSignup({ email: 'not-an-email' }, deps)
    assert.equal(res.status, 400)
    assert.equal(calls.length, 0)
})
