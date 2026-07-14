// Pure signup logic with injected dependencies so it can be unit-tested
// with `node --test` while the Deno entrypoint (index.ts) wires real ones.
//
// Contract (DB is the source of truth):
// - DB save fails            -> non-2xx, generic error, no emails attempted
// - saved but Resend fails   -> 200 with welcomeEmailSent:false, failure
//                               persisted on the row for retry, [ALERT] logged
// - duplicate submission     -> idempotent; retries the welcome email only if
//                               it was never successfully sent
// - Resend key / internal error details never reach the browser

export interface SubscriberRecord {
    email: string
    welcome_email_status: string | null
    welcome_email_attempts: number | null
}

export interface SignupDb {
    /** Returns the existing row or null. Throws on database error. */
    getSubscriber(email: string): Promise<SubscriberRecord | null>
    /** Insert-or-update the signup row. Throws on database error. */
    upsertSubscriber(email: string, firstName?: string): Promise<void>
    /** Persist welcome email outcome. Throws on database error. */
    setWelcomeStatus(
        email: string,
        status: 'sent' | 'failed',
        error: string | null,
        attempts: number,
    ): Promise<void>
}

export interface SignupDeps {
    db: SignupDb
    fetchFn: typeof fetch
    resendApiKey: string
    audienceId: string
    adminEmail: string
    log: (msg: string) => void
    logError: (msg: string) => void
    /** Injectable so tests don't sleep. */
    delayMs: (ms: number) => Promise<void>
}

export interface SignupResult {
    status: number
    body: Record<string, unknown>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function welcomeEmailHtml(): string {
    return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 0; background-color: #F9F7F2; font-family: 'Times New Roman', Times, serif; color: #1A1D2E; }
                    .wrapper { width: 100%; background-color: #F9F7F2; padding: 80px 0; }
                    .letter { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 540px; padding: 100px 60px; text-align: left; box-shadow: 0 4px 30px rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.03); }
                    .logo { font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; display: block; text-align: center; }
                    h1 { font-family: 'Times New Roman', Times, serif; font-size: 28px; font-weight: 400; font-style: italic; line-height: 1.4; margin-bottom: 40px; color: #1A1D2E; }
                    p { font-size: 16px; line-height: 1.9; margin-bottom: 28px; color: #444; font-weight: 300; }
                    .signature { margin-top: 60px; }
                    .closing { font-style: italic; color: #1A1D2E; margin-bottom: 10px; }
                    .host { font-size: 14px; letter-spacing: 1px; color: #888; text-transform: uppercase; }
                    .cta-box { margin: 60px 0; padding: 40px 0; border-top: 1px solid #F0EFEA; border-bottom: 1px solid #F0EFEA; text-align: center; }
                    .btn-primary { display: inline-block; background-color: #1A1D2E; color: #ffffff !important; padding: 18px 40px; text-decoration: none; text-transform: uppercase; letter-spacing: 3px; font-size: 10px; font-weight: bold; border-radius: 2px; }
                    .footer { margin-top: 100px; font-size: 9px; color: #CCC; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
                    .footer a { color: #BBB; text-decoration: none; margin: 0 10px; }
                </style>
            </head>
            <body>
                <center class="wrapper">
                    <div class="letter">
                        <p style="font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; text-align: center;">Swissperiences</p>

                        <h1>Welcome to Swissperiences.</h1>

                        <p>Journey 001 — Stones &amp; Water is currently in final testing in Geneva.</p>
                        <p>You'll be among the first to know when it becomes available on the App Store.</p>
                        <p>Seven chapters. 1.9 kilometres. One city, heard where its stories happened.</p>

                        <div class="cta-box">
                            <a href="https://swissperiences.ch" class="btn-primary">Preview Journey 001</a>
                        </div>

                        <div class="signature">
                            <p class="host">— Swissperiences</p>
                        </div>

                        <div class="footer">
                            © 2026 Swissperiences • Geneva, Switzerland<br><br>
                            <a href="https://swissperiences.ch">Website</a>
                            <a href="mailto:hello@swissperiences.ch">Contact</a>
                        </div>
                    </div>
                </center>
            </body>
            </html>
                    `
}

/**
 * Calls a Resend endpoint and reduces the outcome to { ok, detail } where
 * detail is safe to log/persist (status + Resend error name/message, no key).
 */
async function callResend(
    deps: SignupDeps,
    operation: string,
    url: string,
    payload: Record<string, unknown>,
): Promise<{ ok: boolean; detail: string }> {
    try {
        const res = await deps.fetchFn(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${deps.resendApiKey}`,
            },
            body: JSON.stringify(payload),
        })
        if (res.ok) {
            deps.log(`[NEWSLETTER] ${operation}: HTTP ${res.status}`)
            return { ok: true, detail: `HTTP ${res.status}` }
        }
        let detail = `HTTP ${res.status}`
        try {
            const data = await res.json()
            const name = typeof data?.name === 'string' ? data.name : ''
            const message = typeof data?.message === 'string' ? data.message : ''
            detail = `HTTP ${res.status} ${[name, message].filter(Boolean).join(': ')}`.trim()
        } catch (_) {
            // non-JSON error body; status alone is enough
        }
        deps.logError(`[NEWSLETTER][ALERT] ${operation} failed: ${detail.slice(0, 500)}`)
        return { ok: false, detail: detail.slice(0, 500) }
    } catch (err) {
        const detail = `network error: ${err instanceof Error ? err.message : String(err)}`.slice(0, 500)
        deps.logError(`[NEWSLETTER][ALERT] ${operation} failed: ${detail}`)
        return { ok: false, detail }
    }
}

export async function handleSignup(
    input: { email?: unknown; firstName?: unknown },
    deps: SignupDeps,
): Promise<SignupResult> {
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
    if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
        return { status: 400, body: { error: 'A valid email is required' } }
    }
    const firstName = typeof input.firstName === 'string' ? input.firstName.slice(0, 100) : undefined

    deps.log(`[NEWSLETTER] Processing signup: ${email}`)

    // 1. Database first — it is the source of truth. Failure here is the only
    //    case the browser should see as an error.
    let existing: SubscriberRecord | null
    try {
        existing = await deps.db.getSubscriber(email)
        await deps.db.upsertSubscriber(email, firstName)
    } catch (err) {
        deps.logError(
            `[NEWSLETTER][ALERT] waitlist save failed for ${email}: ${err instanceof Error ? err.message : String(err)}`,
        )
        return { status: 500, body: { error: 'Could not save your signup. Please try again.' } }
    }
    deps.log(`[NEWSLETTER] Saved to waitlist: ${email}`)

    const alreadySubscribed = existing !== null
    const welcomeAlreadySent = existing?.welcome_email_status === 'sent'

    // 2. Resend audience — non-fatal, logged on failure.
    await callResend(
        deps,
        'Resend audience add',
        `https://api.resend.com/audiences/${deps.audienceId}/contacts`,
        { email, ...(firstName ? { first_name: firstName } : {}), unsubscribed: false },
    )

    // 3. Welcome email — skipped only if a previous attempt succeeded, so a
    //    duplicate submission doubles as the retry path for failed sends.
    let welcomeEmailSent = welcomeAlreadySent
    let welcomeAttempted = false
    if (!welcomeAlreadySent) {
        welcomeAttempted = true
        const attempts = (existing?.welcome_email_attempts ?? 0) + 1
        const result = await callResend(deps, 'Welcome email send', 'https://api.resend.com/emails', {
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: "You're on the Swissperiences list",
            html: welcomeEmailHtml(),
        })
        welcomeEmailSent = result.ok
        try {
            await deps.db.setWelcomeStatus(
                email,
                result.ok ? 'sent' : 'failed',
                result.ok ? null : result.detail,
                attempts,
            )
        } catch (err) {
            deps.logError(
                `[NEWSLETTER][ALERT] could not persist welcome email status for ${email}: ${err instanceof Error ? err.message : String(err)}`,
            )
        }
    }

    // 4. Admin notification — non-fatal, logged on failure. Delay keeps us
    //    under Resend's 2 req/s limit when a welcome email was just sent.
    if (welcomeAttempted) {
        await deps.delayMs(1100)
    }
    await callResend(deps, 'Admin notification send', 'https://api.resend.com/emails', {
        from: 'Swissperiences <hello@swissperiences.ch>',
        to: [deps.adminEmail],
        subject: `[WAITLIST] ${email}`,
        html: `
            <div style="font-family: monospace; padding: 20px; background: #111; color: #eee;">
                <h2 style="color: #D8B58A;">New Waitlist Signup</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Already subscribed:</strong> ${alreadySubscribed ? 'Yes' : 'No'}</p>
                <p><strong>Welcome email sent:</strong> ${welcomeEmailSent ? 'Yes' : 'No'}</p>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
                `,
    })

    return {
        status: 200,
        body: {
            success: true,
            subscribed: true,
            welcomeEmailSent,
            already_subscribed: alreadySubscribed,
        },
    }
}
