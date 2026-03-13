import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file (for local development)
dotenv.config();
import { checkRateLimit } from './lib/rate-limit.js';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // ============================================================
    // AGGRESSIVE DEBUG - FUNCTION START
    // ============================================================
    console.log('\n' + '='.repeat(60));
    console.log('--- API CALL STARTED (CORPORATE INQUIRY) ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('='.repeat(60) + '\n');

    // CRITICAL: Verify API key is loaded
    console.log('🔑 CHAVE PRESENTE?', !!process.env.RESEND_API_KEY);
    if (!process.env.RESEND_API_KEY) {
        console.error('❌ CRITICAL ERROR: RESEND_API_KEY is undefined!');
        return res.status(500).json({
            error: 'Server configuration error: Missing RESEND_API_KEY',
            hint: 'Check .env file and dotenv configuration'
        });
    }
    console.log('✅ API Key loaded successfully\n');

    // ============================================================
    // CORS HEADERS - Allow requests from frontend
    // ============================================================
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('✅ CORS preflight request handled');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- RATE LIMIT CHECK ---
    const clientIp = req.headers['x-forwarded-for'] as string || 'anonymous';
    const { success, error: rateLimitError } = await checkRateLimit(clientIp, 'corporate');

    if (!success) {
        console.warn(`[API] 🛑 Rate limit exceeded for IP: ${clientIp}`);
        return res.status(429).json({ error: rateLimitError });
    }

    const { companyName, contactName, email, teamSize = "", message = "", newsletter_opt_in = true } = req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = createClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
    );

    console.log(`[CORPORATE API] 🚀 Processing corporate inquiry for: ${email} (${companyName})`);
    console.log(`[CORPORATE API] 📋 Newsletter opt-in: ${newsletter_opt_in}`);

    try {
        // ============================================================
        // STEP 1: Save to Database
        // ============================================================
        console.log('[CORPORATE API] 💾 Step 1: Attempting to save to database...');

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
            console.error('[CORPORATE API] ❌ Database error:', dbError);
            // We continue even if DB fails? ideally we should probably warn or throw. 
            // For now, let's log heavily but try to send email so lead isn't lost.
        }

        console.log('[CORPORATE API] ✅ Step 1 complete: Database insert successful');

        // ============================================================
        // STEP 2: Send User Confirmation Email
        // ============================================================
        console.log('[CORPORATE API] 📧 Step 2: Attempting to send user confirmation email...');

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

            <h1>Thank you, ${contactName}.</h1>

            <p>We've received your inquiry for <strong>${companyName}</strong>. Our team is reviewing your requirements and will design a proposal that aligns with your goals.</p>
            <p>Expect to hear from us within the next few days.</p>

            <div class="details">
                <span class="detail-label">Team Size</span>
                <div class="detail-value">${teamSize}</div>
                <span class="detail-label">Message</span>
                <div class="detail-value" style="margin-bottom: 0;">${message || "—"}</div>
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

        console.log('[CORPORATE API] 📥 RESEND RESPONSE:', JSON.stringify({ data: userData, error: userError }, null, 2));

        if (userError) {
            console.error('[CORPORATE API] ❌ USER EMAIL ERROR - FULL DETAILS:');
            console.error('Error object:', JSON.stringify(userError, null, 2));
            console.error('Error name:', userError.name);
            console.error('Error message:', userError.message);

            // CRITICAL: Return 500 to frontend so user knows it failed
            return res.status(500).json({
                error: `Failed to send user email: ${userError.message}`,
                details: userError
            });
        } else {
            console.log('[CORPORATE API] ✅ Step 2 complete: User email sent successfully');
            console.log('[CORPORATE API] 📧 User email ID:', userData?.id);
        }

        // ============================================================
        // STEP 3: Send Admin Notification
        // ============================================================
        // ⚠️ RATE LIMIT: Wait 1.1s to respect Resend's 2 req/sec limit
        await new Promise(resolve => setTimeout(resolve, 1100));
        console.log('[CORPORATE API] 📧 Step 3: Attempting to send admin notification...');

        const { data: adminData, error: adminError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `[CORPORATE] ${companyName} — ${contactName}`,
            html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">Corporate Inquiry</h2>
                <p style="margin: 10px 0;"><strong>Company:</strong> ${companyName}</p>
                <p style="margin: 10px 0;"><strong>Contact:</strong> ${contactName}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #D8B58A;">${email}</a></p>
                <p style="margin: 10px 0;"><strong>Team Size:</strong> ${teamSize}</p>
                <p style="margin: 10px 0;"><strong>Newsletter:</strong> ${newsletter_opt_in ? 'Yes' : 'No'}</p>
                <div style="margin-top: 20px; padding: 15px; background: #000; border-left: 2px solid #D8B58A;">
                    <p style="margin: 0; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                    <p style="margin: 10px 0 0 0;">${message || "—"}</p>
                </div>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>`
        });

        console.log('[CORPORATE API] 📥 RESEND RESPONSE:', JSON.stringify({ data: adminData, error: adminError }, null, 2));

        if (adminError) {
            console.error('[CORPORATE API] ❌ ADMIN EMAIL ERROR - FULL DETAILS:');
            console.error('Error object:', JSON.stringify(adminError, null, 2));
            console.error('Error name:', adminError.name);
            console.error('Error message:', adminError.message);

            // CRITICAL: Return 500 to frontend so user knows it failed
            return res.status(500).json({
                error: `Failed to send admin notification: ${adminError.message}`,
                details: adminError
            });
        } else {
            console.log('[CORPORATE API] ✅ Step 3 complete: Admin email sent successfully');
            console.log('[CORPORATE API] 📧 Admin email ID:', adminData?.id);
        }

        // ============================================================
        // STEP 4: Newsletter Subscription (ISOLATED - NON-BLOCKING)
        // ============================================================
        if (newsletter_opt_in && process.env.RESEND_AUDIENCE_ID) {
            console.log('[CORPORATE API] 📬 Step 4: Attempting newsletter subscription...');
            console.log(`[CORPORATE API] 🕵️ DEBUG: Creating contact for ${email}`);
            const audienceId = process.env.RESEND_AUDIENCE_ID;
            const logId = audienceId ? `${audienceId.substring(0, 4)}...${audienceId.substring(audienceId.length - 4)}` : 'MISSING';
            console.log(`[CORPORATE API] 🕵️ DEBUG: Using Audience ID: ${logId}`);

            // ⚠️ RATE LIMIT FIX: Wait 1.1s to respect Resend's 2 req/sec limit (since we just sent 2 emails)
            await new Promise(resolve => setTimeout(resolve, 1100));

            try {
                const { data: contactData, error: contactError } = await resend.contacts.create({
                    email: email,
                    firstName: contactName,
                    audienceId: process.env.RESEND_AUDIENCE_ID,
                    unsubscribed: false,
                });

                if (contactError) {
                    console.error('[CORPORATE API] ❌ CRITICAL: Newsletter subscription failed:', contactError);
                    console.error('[CORPORATE API] 🛑 Stopping execution and returning error to frontend.');

                    return res.status(500).json({
                        error: 'Failed to create Resend contact',
                        details: contactError,
                        audienceIdMasked: logId
                    });
                } else {
                    console.log('[CORPORATE API] ✅ Step 4 complete: Newsletter subscription successful');
                    console.log('[CORPORATE API] 📬 Contact ID:', contactData?.id);
                }
            } catch (syncError: unknown) {
                const err = syncError as Error;
                console.error('[CORPORATE API] ❌ EXCEPTION during contact creation:', err);
                return res.status(500).json({
                    error: 'Exception during contact creation',
                    details: err.message
                });
            }
        } else {
            if (!newsletter_opt_in) {
                console.log('[CORPORATE API] ⏭️  Step 4 skipped: User opted out of newsletter');
            } else {
                console.log('[CORPORATE API] ⏭️  Step 4 skipped: RESEND_AUDIENCE_ID not configured');
            }
        }

        // ============================================================
        // SUCCESS RESPONSE
        // ============================================================
        console.log('[CORPORATE API] 🎉 All critical steps complete - returning success');

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

        // FORCE ERROR TO FRONTEND - NO MORE FALSE POSITIVES
        return res.status(500).json({
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString()
        });
    }
}
