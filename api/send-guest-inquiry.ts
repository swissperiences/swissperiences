import { Resend } from 'resend';
import * as dotenv from 'dotenv';

dotenv.config();
import { checkRateLimit } from './lib/rate-limit.js';

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Selection {
    name: string;
    price: number;
    category: 'experience' | 'extra';
}

// Server-side price catalog — source of truth
const PRICE_CATALOG: Record<string, { name: string; price: number; category: 'experience' | 'extra' }> = {
    road_journey:       { name: 'Alps Road Journey',       price: 850, category: 'experience' },
    guided_hike:        { name: 'Guided Alpine Hike',      price: 300, category: 'experience' },
    cinematic_memories: { name: 'Cinematic Memories',       price: 600, category: 'experience' },
    private_chef:       { name: 'Private Chef Evening',     price: 400, category: 'experience' },
    early_checkin:      { name: 'Early Check-in (10:00)',   price: 50,  category: 'extra' },
    late_checkout:      { name: 'Late Check-out (14:00)',   price: 50,  category: 'extra' },
    transfer:           { name: 'Station Transfer',         price: 80,  category: 'extra' },
    welcome_package:    { name: 'Welcome Package',          price: 75,  category: 'extra' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const allowedOrigins = ['https://swissperiences.ch', 'https://www.swissperiences.ch'];
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Rate limit: 5 requests per 10 minutes (reuse waitlist limiter)
    const clientIp = (req.headers['x-real-ip'] as string) || (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'anonymous';
    const { success: rateLimitOk, error: rateLimitError } = await checkRateLimit(clientIp, 'waitlist');
    if (!rateLimitOk) {
        return res.status(429).json({ error: rateLimitError });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const { guestName, guestEmail, checkIn, checkOut, selections, notes } = req.body;

    if (!guestName || !guestEmail || !Array.isArray(selections) || selections.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(guestEmail).slice(0, 200))) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    if (selections.length > Object.keys(PRICE_CATALOG).length) {
        return res.status(400).json({ error: 'Too many selections' });
    }

    // Validate & resolve selections against server-side catalog
    const safeSelections: Selection[] = [];
    for (const sel of selections) {
        const catalogItem = PRICE_CATALOG[sel.id];
        if (!catalogItem) {
            return res.status(400).json({ error: `Unknown item: ${String(sel.id).slice(0, 50)}` });
        }
        safeSelections.push(catalogItem);
    }

    // Recalculate total server-side — never trust client total
    const total = safeSelections.reduce((sum, s) => sum + s.price, 0);

    const resend = new Resend(RESEND_API_KEY);
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const formatCHF = (amount: number) => `CHF ${amount.toLocaleString('de-CH')}`;
    const safeName = esc(String(guestName).slice(0, 200));
    const safeEmail = esc(String(guestEmail).slice(0, 200));

    const experienceItems = safeSelections.filter(s => s.category === 'experience');
    const extraItems = safeSelections.filter(s => s.category === 'extra');

    const dateInfo = checkIn && checkOut
        ? `${new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} — ${new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
        : checkIn
            ? new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Not specified';

    try {
        // 1. Admin notification
        const selectionRows = safeSelections.map(s =>
            `<p style="margin: 4px 0; color: #F3F4F6;">${esc(s.name)} — <span style="color: #D8B58A;">${formatCHF(s.price)}</span></p>`
        ).join('');

        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `[GUEST UPSELL] ${safeName} — ${formatCHF(total)}`,
            html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <div style="border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between;">
                    <span style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #fff; font-weight: 700;">Guest Add-on Request</span>
                    <span style="background: #D8B58A; color: #111; font-size: 10px; padding: 4px 8px; font-weight: bold;">AIRBNB GUEST</span>
                </div>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Guest</span><br><span style="color: #F3F4F6;">${safeName}</span></p>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</span><br><a href="mailto:${safeEmail}" style="color: #D8B58A;">${safeEmail}</a></p>
                <p style="margin: 10px 0;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Stay Dates</span><br><span style="color: #F3F4F6;">${dateInfo}</span></p>
                <div style="margin: 15px 0; padding: 12px; background: #000; border-left: 2px solid #D8B58A;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Selections</p>
                    ${selectionRows}
                </div>
                <p style="margin: 15px 0; padding-top: 12px; border-top: 1px solid #333;"><span style="color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Estimated Total</span><br><span style="color: #D8B58A; font-size: 18px; font-weight: 700;">${formatCHF(total)}</span></p>
                ${notes ? `<div style="margin: 15px 0; padding: 12px; background: #000; border-left: 2px solid #555;"><p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Notes</p><p style="margin: 8px 0 0 0; color: #eee; font-size: 13px;">${esc(notes)}</p></div>` : ''}
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>`,
        });

        // 2. Guest confirmation (delay for Resend rate limit)
        await new Promise(r => setTimeout(r, 1100));

        const experiencesList = experienceItems.length > 0
            ? experienceItems.map(s => `<span class="detail-row"><span class="detail-label">Experience</span><span class="detail-value">${esc(s.name)} — ${formatCHF(s.price)}</span></span>`).join('')
            : '';
        const extrasList = extraItems.length > 0
            ? extraItems.map(s => `<span class="detail-row"><span class="detail-label">Extra</span><span class="detail-value">${esc(s.name)} — ${formatCHF(s.price)}</span></span>`).join('')
            : '';

        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [guestEmail],
            subject: `[Swissperiences] We received your request — next steps`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 0; background-color: #F9F7F2; font-family: 'Times New Roman', Times, serif; color: #1A1D2E; }
                    .wrapper { width: 100%; background-color: #F9F7F2; padding: 80px 0; }
                    .letter { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 540px; padding: 100px 60px; text-align: left; box-shadow: 0 4px 30px rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.03); }
                    h1 { font-family: 'Times New Roman', Times, serif; font-size: 28px; font-weight: 400; font-style: italic; line-height: 1.4; margin-bottom: 40px; color: #1A1D2E; }
                    p { font-size: 16px; line-height: 1.9; margin-bottom: 28px; color: #444; font-weight: 300; }
                    .detail-row { display: block; margin-bottom: 12px; }
                    .detail-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; display: block; margin-bottom: 2px; }
                    .detail-value { font-size: 15px; color: #1A1D2E; }
                    .footer { margin-top: 100px; font-size: 9px; color: #CCC; letter-spacing: 2px; text-transform: uppercase; text-align: center; }
                    .footer a { color: #BBB; text-decoration: none; margin: 0 10px; }
                </style>
            </head>
            <body>
                <center class="wrapper">
                    <div class="letter">
                        <p style="font-size: 10px; letter-spacing: 5px; text-transform: uppercase; color: #BBB; margin-bottom: 70px; text-align: center;">Swissperiences</p>

                        <h1>Thank you, ${safeName.split(' ')[0]}.</h1>

                        <p>We've received your request and we're excited to enhance your stay in the Swiss Alps.</p>

                        <div style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 28px 0; margin: 30px 0;">
                            <span class="detail-row"><span class="detail-label">Stay Dates</span><span class="detail-value">${dateInfo}</span></span>
                            ${experiencesList}
                            ${extrasList}
                            <span class="detail-row" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
                                <span class="detail-label">Estimated Total</span>
                                <span class="detail-value" style="font-size: 20px; font-family: 'Times New Roman', Times, serif;">${formatCHF(total)}</span>
                            </span>
                            <p style="font-size: 12px; color: #bbb; margin: 4px 0 0 0;">Final pricing confirmed after availability check.</p>
                        </div>

                        ${notes ? `<p style="padding: 20px; background: #FAFAF8; border-left: 2px solid #1A1D2E; font-size: 14px; color: #666; font-style: italic;">Your notes: ${esc(notes)}</p>` : ''}

                        <p style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 12px; font-family: Arial, sans-serif;">What happens next</p>
                        <p>We'll confirm availability and reach out within 24 hours to arrange everything.</p>

                        <p style="font-size: 14px; color: #888; font-style: italic;">If you have questions, simply reply to this email.</p>

                        <div style="margin-top: 60px;">
                            <p style="font-style: italic; color: #1A1D2E; margin-bottom: 10px;">See you in the mountains.</p>
                            <p style="font-size: 14px; letter-spacing: 1px; color: #888; text-transform: uppercase;">— Swissperiences</p>
                        </div>

                        <div class="footer">
                            &copy; 2026 Swissperiences &middot; Geneva, Switzerland<br><br>
                            <a href="https://swissperiences.ch">Website</a>
                            <a href="mailto:hello@swissperiences.ch">Contact</a>
                        </div>
                    </div>
                </center>
            </body>
            </html>`,
        });

        console.log(`[GUEST UPSELL] Request received: ${safeEmail} — ${safeSelections.length} items — ${formatCHF(total)}`);

        return res.status(200).json({ success: true });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('[GUEST UPSELL] Error:', err.message);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
}
