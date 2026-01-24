import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // ============================================================
    // AGGRESSIVE DEBUG - FUNCTION START
    // ============================================================
    console.log('\n' + '='.repeat(60));
    console.log('--- API CALL STARTED (WAITLIST) ---');
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

    const {
        email,
        first_name = null,
        newsletter_opt_in = true,
        tier = 'General Waitlist',
        intent = null,
        season = null,
        start_date = null,
        end_date = null,
        num_guests = null
    } = req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';

    console.log(`[API] Processing waitlist signup for: ${email}`);
    if (intent) console.log(`[API] 🎯 Intent: ${intent}`);
    if (season) console.log(`[API] 🏔️ Season: ${season}`);
    if (start_date) console.log(`[API] 📅 Dates: ${start_date} to ${end_date}`);
    if (num_guests) console.log(`[API] 👥 Guests: ${num_guests}`);

    try {
        // 1. Save to database first
        const insertData: Record<string, unknown> = {
            email: email,
            newsletter_opt_in: newsletter_opt_in
        };

        // Only add first_name if provided (and if column exists in DB)
        if (first_name) {
            insertData.first_name = first_name;
        }

        const { error: dbError } = await supabase
            .from('waitlist')
            .insert(insertData);

        if (dbError) {
            // Check for duplicate email
            if (dbError.code === '23505') {
                return res.status(200).json({
                    success: true,
                    message: 'Email already registered'
                });
            }
            console.error('[API] Database error:', dbError);
            throw dbError;
        }

        // 2. Continue with email sending...
        // TEST MODE: Log emails to console instead of sending
        if (isTestMode) {
            console.log('\n🧪 EMAIL TEST MODE - Email would be sent:\n');
            console.log('📧 User Welcome Email:');
            console.log(`   To: ${email}`);
            console.log(`   From: Swissperiences <hello@swissperiences.ch>`);
            console.log(`   Subject: You've found your way in.`);
            console.log(`   Newsletter Opt-in: ${newsletter_opt_in ? '✓' : '✗'}`);
            console.log('\n📧 Internal Notification:');
            console.log(`   To: hello@swissperiences.ch`);
            console.log(`   Subject: [INTEL] New Waitlist: ${email}`);
            console.log(`   Timestamp: ${new Date().toISOString()}\n`);

            return res.status(200).json({
                success: true,
                testMode: true,
                message: 'Email logged to console (test mode)'
            });
        }
        // 1. Send confirmation to user
        let emailSubject = 'You’ve found your way in.';
        if (intent === 'day-pass' && tier) {
            emailSubject = `Your Swissperience Request: ${tier}`;
        }

        const { data: userData, error: userError } = await resend.emails.send({
            from: 'hello@swissperiences.ch',
            to: [email],
            subject: emailSubject,
            html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Welcome to Swissperiences</title> <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D2E; -webkit-font-smoothing: antialiased; } .wrapper { width: 100%; table-layout: fixed; background-color: #FAFAFA; padding: 60px 0; } .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 580px; border-spacing: 0; color: #1A1D2E; box-shadow: 0 20px 40px rgba(0,0,0,0.03); padding: 60px 50px; text-align: center; } .header-logo { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; font-weight: 400; color: #1A1D2E; margin-bottom: 50px; display: block; } .hero-image { width: 100%; height: auto; display: block; margin-bottom: 50px; filter: contrast(1.05); } h1 { font-family: 'Times New Roman', Times, serif; font-size: 34px; font-weight: 400; font-style: italic; line-height: 1.25; margin-bottom: 30px; color: #1A1D2E; } p { font-size: 15px; line-height: 1.8; margin-bottom: 22px; color: #555; font-weight: 300; text-align: left; } .quote-box { margin: 40px 0; padding: 30px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; } .quote { font-family: 'Times New Roman', Times, serif; font-style: italic; font-size: 20px; color: #1A1D2E; margin: 0; } .perks-list { text-align: left; padding-left: 20px; margin: 40px 0; color: #444; } .perks-list li { margin-bottom: 10px; font-size: 14px; } .footer { margin-top: 60px; font-size: 11px; color: #999; letter-spacing: 1px; text-transform: uppercase; } .footer a { color: #1A1D2E; text-decoration: none; border-bottom: 1px solid #eee; } .btn-primary { display: inline-block; background-color: #D8B58A; color: #000000; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; margin-top: 30px; font-weight: bold; } </style> </head> <body> <center class="wrapper"> <div class="main"> <span class="header-logo">Swissperiences</span> <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop" alt="The Matterhorn" class="hero-image"> <h1>You have found<br>your way in.</h1> <p>There are a thousand ways to visit Switzerland. You chose the quietest one.</p> <p>You have joined a small circle of travelers who understand that the best journeys aren't measured in destinations checked off a list—they are measured in moments of genuine stillness.</p> <div class="quote-box"> <p class="quote">Switzerland.<br>A state of mind.</p> </div> <p style="font-weight: 500; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #D8B58A; margin-top: 40px;">Founding Member Privileges</p> <ul class="perks-list"> <li>Access to invite-only, seasonal experiences.</li> <li>Preferred pricing, locked in for your first journey.</li> <li>Personal stories from our local hosts.</li> </ul> <p style="margin-top: 20px;">To secure your priority position immediately, you may place a fully refundable deposit.</p> <a href="https://swissperiences.ch/secure-deposit" class="btn-primary">Secure Priority</a> <p style="margin-top: 50px; font-size: 13px; color: #888; text-align: center;"> We move intentionally here. We will reach out personally when your first invitation is ready. In the meantime, breathe. </p> <div class="footer"> © 2025 Swissperiences • Geneva, Switzerland<br><br> <a href="https://swissperiences.ch">Website</a> &nbsp; <a href="mailto:hello@swissperiences.ch">Contact</a> </div> </div> </center> </body> </html>`,
        });

        if (userError) {
            console.error('[API] Resend user error:', userError);
            throw new Error(`Failed to send user email: ${userError.message}`);
        }
        console.log('[API] Resend user data:', userData);

        // 2. Internal Notification
        const { data: adminData, error: adminError } = await resend.emails.send({
            from: 'hello@swissperiences.ch',
            to: ['hello@swissperiences.ch'],
            subject: `[INTEL] New Waitlist: ${email}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Intelligence Report</title>
    <style>
        body { background-color: #1A1D2E; color: #E5E7EB; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 40px 20px; }
        .intel-card { background-color: #11131F; max-width: 500px; margin: 0 auto; border: 1px solid #333; border-top: 4px solid #777; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
        .title { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #fff; font-weight: 700; }
        .badge { background: #555; color: #fff; font-size: 10px; padding: 4px 8px; font-weight: bold; border-radius: 2px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 5px; }
        .label { color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .value { color: #F3F4F6; font-size: 13px; font-weight: 500; text-align: right; }
        .footer { margin-top: 30px; font-size: 10px; color: #4B5563; text-align: center; letter-spacing: 1px; }
        .action-link { display: block; text-align: center; margin-top: 25px; color: #fff; text-decoration: none; font-size: 12px; border: 1px solid #555; padding: 10px; transition: all 0.2s; }
        .action-link:hover { background: #333; }
    </style>
</head>
<body>
    <div class="intel-card">
        <div class="header">
            <span class="title">New Signal</span>
            <span class="badge">WAITLIST</span>
        </div>
        
        <div class="data-row">
            <span class="label">Access ID</span>
            <span class="value">${email}</span>
        </div>
        <div class="data-row">
            <span class="label">Timestamp urn</span>
            <span class="value">${new Date().toISOString()}</span>
        </div>
        <div class="data-row">
            <span class="label">Origin</span>
            <span class="value">swissperiences.ch</span>
        </div>
        <div class="data-row">
            <span class="label">Context / Tier</span>
            <span class="value" style="color: #D8B58A;">${tier}</span>
        </div>
        ${intent ? `
        <div class="data-row">
            <span class="label">Primary Attraction</span>
            <span class="value">${intent}</span>
        </div>` : ''}
        ${season ? `
        <div class="data-row">
            <span class="label">Preferred Timing</span>
            <span class="value">${season}</span>
        </div>` : ''}
        ${start_date ? `
        <div class="data-row">
            <span class="label">Requested Dates</span>
            <span class="value">${start_date} - ${end_date || 'N/A'}</span>
        </div>` : ''}
        ${num_guests ? `
        <div class="data-row">
            <span class="label">Guests</span>
            <span class="value">${num_guests}</span>
        </div>` : ''}
        <div class="data-row">
            <span class="label">Newsletter Consent</span>
            <span class="value" style="color: ${newsletter_opt_in ? '#10B981' : '#EF4444'};">${newsletter_opt_in ? '✓ OPTED-IN' : '✗ OPTED-OUT'}</span>
        </div>

        <a href="mailto:${email}" class="action-link">:: ACKNOWLEDGE SIGNAL ::</a>
        
        <div class="footer">
            SECURE TRANSMISSION // ${new Date().toISOString().split('T')[0]}<br>
            SWISSPERIENCES INTELLIGENCE UNIT
        </div>
    </div>
</body>
</html>`,
        });

        if (adminError) {
            console.error('[API] Resend admin error:', adminError);
            throw new Error(`Failed to send admin notification: ${adminError.message}`);
        }
        console.log('[API] Resend admin data:', adminData);

        // 3. Sync to Resend Audiences (Automation)
        if (newsletter_opt_in && process.env.RESEND_AUDIENCE_ID) {
            console.log(`[API] 🕵️ DEBUG: Creating waitlist contact for ${email}`);
            const audienceId = process.env.RESEND_AUDIENCE_ID;
            const logId = audienceId ? `${audienceId.substring(0, 4)}...${audienceId.substring(audienceId.length - 4)}` : 'MISSING';
            console.log(`[API] 🕵️ DEBUG: Using Audience ID: ${logId}`);

            // ⚠️ RATE LIMIT FIX: Wait 1.1s to respect Resend's 2 req/sec limit
            await new Promise(resolve => setTimeout(resolve, 1100));

            try {
                const { data: contactData, error: contactError } = await resend.contacts.create({
                    email: email,
                    audienceId: process.env.RESEND_AUDIENCE_ID,
                    unsubscribed: false,
                    firstName: first_name || undefined
                });

                if (contactError) {
                    console.error('[API] ❌ CRITICAL: Waitlist subscription failed:', contactError);

                    return res.status(500).json({
                        error: 'Failed to create Resend contact',
                        details: contactError,
                        audienceIdMasked: logId
                    });
                } else {
                    console.log('[API] Resend contact sync success:', contactData);
                }
            } catch (syncError: unknown) {
                const err = syncError as Error;
                console.error('[API] ❌ EXCEPTION during contact creation:', err);
                return res.status(500).json({
                    error: 'Exception during contact creation',
                    details: err.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            userMessageId: userData?.id,
            adminMessageId: adminData?.id
        });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('\n' + '='.repeat(60));
        console.error('💥 CRITICAL ERROR IN WAITLIST API');
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
