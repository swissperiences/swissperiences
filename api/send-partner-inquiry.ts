import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();
import { checkRateLimit } from './lib/rate-limit.js';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    console.log('[PARTNER API] Request received:', req.method);

    if (!process.env.RESEND_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const allowedOrigins = ['https://swissperiences.ch', 'https://www.swissperiences.ch'];
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const clientIp = (req.headers['x-real-ip'] as string) || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'anonymous';
    const { success, error: rateLimitError } = await checkRateLimit(clientIp, 'partner');

    if (!success) {
        console.warn(`[PARTNER API] Rate limit exceeded for IP: ${clientIp}`);
        return res.status(429).json({ error: rateLimitError });
    }

    const { type, ...fields } = req.body;

    if (!type || !['partnership', 'listing'].includes(type)) {
        return res.status(400).json({ error: 'Invalid inquiry type' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    try {
        const isPartnership = type === 'partnership';
        const name = fields.contactName || 'Unknown';
        const email = fields.email;
        const business = fields.companyName || fields.businessName || 'Not specified';

        if (!email) return res.status(400).json({ error: 'Email is required' });

        // ============================================================
        // STEP 1: Send confirmation email to applicant
        // ============================================================
        const confirmSubject = isPartnership
            ? "We've received your partnership inquiry."
            : "We've received your listing application.";

        const confirmBody = isPartnership
            ? `<p>We've received your partnership inquiry for <strong>${esc(business)}</strong>. Our team will review it and get back to you shortly.</p>`
            : `<p>Thank you for applying to list <strong>${esc(business)}</strong> on Swissperiences. We'll review your application and reach out within a few days.</p>`;

        const { data: userData, error: userError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: confirmSubject,
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
            <h1>Thank you, ${esc(name)}.</h1>
            ${confirmBody}
            <p>In the meantime, feel free to explore our platform at <a href="https://swissperiences.ch" style="color: #1A1D2E;">swissperiences.ch</a>.</p>
            <div class="signature">
                <p class="closing">We look forward to connecting.</p>
                <p class="host">&mdash; Swissperiences</p>
            </div>
            <div class="footer">
                &copy; 2026 Swissperiences &bull; Geneva, Switzerland<br><br>
                <a href="https://swissperiences.ch">Website</a>
                <a href="mailto:hello@swissperiences.ch">Contact</a>
            </div>
        </div>
    </center>
</body>
</html>`
        });

        if (userError) {
            console.error('[PARTNER API] User email error:', userError);
            return res.status(500).json({ error: 'Failed to send confirmation email. Please try again.' });
        }
        console.log('[PARTNER API] Confirmation email sent:', userData?.id);

        // ============================================================
        // STEP 2: Send admin notification
        // ============================================================
        await new Promise(resolve => setTimeout(resolve, 1100));

        const subjectPrefix = isPartnership ? '[PARTNERSHIP]' : '[LISTING APPLICATION]';
        const adminFields = Object.entries(fields)
            .filter(([_, v]) => v)
            .map(([k, v]) => `<p style="margin: 10px 0;"><strong>${esc(k)}:</strong> ${esc(String(v))}</p>`)
            .join('');

        const { data: adminData, error: adminError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `${subjectPrefix} ${business} — ${name}`,
            html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">${isPartnership ? 'Partnership Inquiry' : 'Listing Application'}</h2>
                ${adminFields}
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>`
        });

        if (adminError) {
            console.error('[PARTNER API] Admin email error:', adminError);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('[PARTNER API] Admin notification sent:', adminData?.id);

        // Sync to Resend audience (fire-and-forget — don't block response)
        if (process.env.RESEND_AUDIENCE_ID) {
            resend.contacts.create({
                email,
                firstName: name.split(' ')[0],
                audienceId: process.env.RESEND_AUDIENCE_ID,
                unsubscribed: false,
            }).catch((err: unknown) => {
                console.error('[PARTNER API] Audience sync failed (non-blocking):', err);
            });
        }

        return res.status(200).json({
            success: true,
            userMessageId: userData?.id,
            adminMessageId: adminData?.id
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[PARTNER API] Error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
