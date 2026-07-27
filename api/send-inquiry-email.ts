import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file (for local development)
dotenv.config();
import { checkRateLimit } from './lib/rate-limit.js';
import { getSupabaseSecretKey } from './lib/supabase-key.js';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // createClient below throws "supabaseKey is required" when the key is
    // missing, which would surface as an opaque FUNCTION_INVOCATION_FAILED.
    if (!process.env.RESEND_API_KEY || !getSupabaseSecretKey() || !process.env.VITE_SUPABASE_URL) {
        console.error('[CORPORATE API] Server configuration error: missing Resend or Supabase environment variables');
        return res.status(500).json({
            error: 'Server configuration error'
        });
    }

    const allowedOrigins = ['https://swissperiences.ch', 'https://www.swissperiences.ch'];
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- RATE LIMIT CHECK ---
    const clientIp = (req.headers['x-real-ip'] as string) || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'anonymous';
    const { success, error: rateLimitError } = await checkRateLimit(clientIp, 'corporate');

    if (!success) {
        console.warn(`[API] 🛑 Rate limit exceeded for IP: ${clientIp}`);
        return res.status(429).json({ error: rateLimitError });
    }

    const { companyName, contactName, email, teamSize = "", message = "", newsletter_opt_in = true } = req.body;

    // Input validation
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!companyName || !contactName) {
        return res.status(400).json({ error: 'Company name and contact name are required' });
    }

    const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        getSupabaseSecretKey()!
    );

    try {

        const { error: dbError } = await supabase
            .from('corporate_inquiries')
            .insert({
                company_name: companyName,
                contact_name: contactName,
                email: email,
                team_size: teamSize,
                message: message,
                newsletter_opt_in: newsletter_opt_in,
                status: 'new'
            });

        if (dbError) {
            // The inquiry row is the source of truth. Sending the emails and
            // returning 200 on a failed insert made the form look successful
            // while the lead was silently dropped — fail loudly instead so the
            // visitor can retry and the failure shows up in the logs.
            console.error('[CORPORATE API] ❌ Database error:', dbError);
            return res.status(503).json({
                error: 'Could not save your inquiry. Please try again.',
            });
        }

        const { data: userData, error: userError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: "We've received your inquiry.",
            html: `<!DOCTYPE html>
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
        .details { margin: 40px 0; padding: 30px; background: #FAFAF8; border-left: 2px solid #1A1D2E; }
        .detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 5px; display: block; }
        .detail-value { font-size: 14px; color: #1A1D2E; font-weight: 500; margin-bottom: 20px; }
        .signature { margin-top: 60px; }
        .closing { font-style: italic; color: #1A1D2E; margin-bottom: 10px; }
        .host { font-size: 14px; letter-spacing: 1px; color: #888; text-transform: uppercase; }
        .footer { margin-top: 100px; font-size: 9px; color: #CCC; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
        .footer a { color: #BBB; text-decoration: none; margin: 0 10px; }
    </style>
</head>
<body>
    <center class="wrapper">
        <div class="letter">
            <span class="logo">S W I S S P E R I E N C E S</span>

            <h1>Thank you, ${esc(contactName)}.</h1>

            <p>We've received your inquiry for <strong>${esc(companyName)}</strong>. Our team is reviewing your requirements and will design a proposal that aligns with your goals.</p>
            <p>Expect to hear from us within the next few days.</p>

            <div class="details">
                <span class="detail-label">Team Size</span>
                <div class="detail-value">${esc(teamSize)}</div>
                <span class="detail-label">Message</span>
                <div class="detail-value" style="margin-bottom: 0;">${esc(message) || "—"}</div>
            </div>

            <div class="signature">
                <p class="closing">We look forward to working with your team.</p>
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
</html>`
        });

        if (userError) {
            console.error('[CORPORATE API] User email error:', userError.message);
            return res.status(500).json({
                error: 'Failed to send confirmation email. Please try again.'
            });
        }

        // Wait to respect Resend's 2 req/sec rate limit
        await new Promise(resolve => setTimeout(resolve, 1100));

        const { data: adminData, error: adminError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch', 'cauehvidal@gmail.com'],
            subject: `[CORPORATE] ${companyName} — ${contactName}`,
            html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">Corporate Inquiry</h2>
                <p style="margin: 10px 0;"><strong>Company:</strong> ${esc(companyName)}</p>
                <p style="margin: 10px 0;"><strong>Contact:</strong> ${esc(contactName)}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${esc(email)}" style="color: #D8B58A;">${esc(email)}</a></p>
                <p style="margin: 10px 0;"><strong>Team Size:</strong> ${esc(teamSize)}</p>
                <p style="margin: 10px 0;"><strong>Newsletter:</strong> ${newsletter_opt_in ? 'Yes' : 'No'}</p>
                <div style="margin-top: 20px; padding: 15px; background: #000; border-left: 2px solid #D8B58A;">
                    <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                    <p style="margin: 10px 0 0 0;">${esc(message) || "—"}</p>
                </div>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>`
        });

        if (adminError) {
            console.error('[CORPORATE API] Admin email error:', adminError.message);
            return res.status(500).json({
                error: 'Failed to send admin notification. Please try again.'
            });
        }

        // Sync to Resend audience (fire-and-forget — don't block form submission)
        if (newsletter_opt_in && process.env.RESEND_AUDIENCE_ID) {
            resend.contacts.create({
                email: email,
                firstName: contactName,
                audienceId: process.env.RESEND_AUDIENCE_ID,
                unsubscribed: false,
            }).catch((err: unknown) => {
                console.error('[CORPORATE API] Audience sync failed (non-blocking):', err);
            });
        }

        return res.status(200).json({
            success: true,
            userMessageId: userData?.id,
            adminMessageId: adminData?.id
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('\n' + '='.repeat(60));
        console.error('💥 CRITICAL ERROR IN CORPORATE API');
        console.error('='.repeat(60));
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('='.repeat(60) + '\n');

        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
