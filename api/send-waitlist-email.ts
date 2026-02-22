import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkRateLimit } from './lib/rate-limit.js';

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

    // --- RATE LIMIT CHECK ---
    const clientIp = req.headers['x-forwarded-for'] as string || 'anonymous';
    const { success, error: rateLimitError } = await checkRateLimit(clientIp, 'waitlist');

    if (!success) {
        console.warn(`[API] 🛑 Rate limit exceeded for IP: ${clientIp}`);
        return res.status(429).json({ error: rateLimitError });
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
        num_guests = null,
        message = null,
        language = 'en'
    } = req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const isTestMode = process.env.EMAIL_TEST_MODE === 'true';

    // ============================================================
    // LUXURY HANDWRITTEN CONTENT
    // ============================================================
    const translations = {
        en: {
            subject: "You're on the waitlist.",
            greeting: "We've noted your interest.",
            body1: "There are many ways to experience Switzerland. You've chosen the quietest one. We've received your request with complete discretion.",
            body2: "We'll review your details personally and be in touch within the next 48 hours.",
            closing1: "Until then, the mountains will be here.",
            closing2: "— Swissperiences",
            cta: "Explore",
            ctaSub: "",
            website: "Website",
            contact: "Contact"
        },
        pt: {
            subject: "Você está na lista de espera.",
            greeting: "Recebemos o seu interesse.",
            body1: "Existem muitas formas de conhecer a Suíça. Você escolheu a mais silenciosa. Recebemos a sua solicitação com total discrição.",
            body2: "Vamos analisar os seus detalhes pessoalmente e entraremos em contato nas próximas 48 horas.",
            closing1: "Até lá, as montanhas estarão aqui.",
            closing2: "— Swissperiences",
            cta: "Explorar",
            ctaSub: "",
            website: "Website",
            contact: "Contato"
        }
    };

    const content = (language === 'pt' || language?.startsWith('pt')) ? translations.pt : translations.en;

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="${language}">
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
                <span class="logo">S W I S S P E R I E N C E S</span>

                <h1>${content.greeting}</h1>

                <p>${content.body1}</p>
                <p>${content.body2}</p>

                <div class="cta-box">
                    <a href="https://swissperiences.ch" class="btn-primary">${content.cta}</a>
                </div>

                <div class="signature">
                    <p class="closing">${content.closing1}</p>
                    <p class="host">${content.closing2}</p>
                </div>

                <div class="footer">
                    © 2026 Swissperiences • Geneva, Switzerland<br><br>
                    <a href="https://swissperiences.ch">${content.website}</a>
                    <a href="mailto:hello@swissperiences.ch">${content.contact}</a>
                </div>
            </div>
        </center>
    </body>
    </html>`;

    console.log(`[API] Processing waitlist signup for: ${email} (${language})`);
    if (intent) console.log(`[API] 🎯 Intent: ${intent}`);
    if (season) console.log(`[API] 🏔️ Season: ${season}`);
    if (start_date) console.log(`[API] 📅 Dates: ${start_date} to ${end_date}`);
    if (num_guests) console.log(`[API] 👥 Guests: ${num_guests}`);
    if (message) console.log(`[API] 💬 Message: ${message}`);

    try {
        // 1. Save to database first
        const insertData: Record<string, unknown> = {
            email: email,
            newsletter_opt_in: newsletter_opt_in
        };

        if (first_name) {
            insertData.first_name = first_name;
        }

        const { error: dbError } = await supabase
            .from('waitlist')
            .insert(insertData);

        if (dbError) {
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
        if (isTestMode) {
            console.log('\n🧪 EMAIL TEST MODE - Email would be sent:\n');
            console.log('📧 User Welcome Email:');
            console.log(`   To: ${email}`);
            console.log(`   From: Swissperiences <hello@swissperiences.ch>`);
            console.log(`   Subject: ${content.subject}`);
            console.log(`   Language: ${language}`);
            console.log('\n📧 Internal Notification:\n');

            return res.status(200).json({
                success: true,
                testMode: true,
                message: 'Email logged to console (test mode)'
            });
        }

        // 1. Send confirmation to user
        let emailSubject = content.subject;
        if (intent === 'day-pass' && tier) {
            emailSubject = (language === 'pt' || language?.startsWith('pt')) ? `Solicitação Swissperience: ${tier}` : `Your Swissperience Request: ${tier}`;
        }

        const { data: userData, error: userError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: emailSubject,
            html: emailHtml,
        });

        if (userError) {
            console.error('[API] Resend user error:', userError);
            throw new Error(`Failed to send user email: ${userError.message}`);
        }

        // 2. Internal Notification (delay to avoid Resend 2 req/sec rate limit)
        await new Promise(resolve => setTimeout(resolve, 1100));
        const { error: adminError } = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `[WAITLIST] ${email}`,
            html: `
            <div style="font-family: 'Courier New', monospace; padding: 30px; background: #111; color: #eee; line-height: 1.6;">
                <h2 style="color: #D8B58A; border-bottom: 1px solid #333; padding-bottom: 10px;">New Waitlist Signup</h2>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0;"><strong>Tier:</strong> ${tier}</p>
                <p style="margin: 10px 0;"><strong>Intent:</strong> ${intent || '—'}</p>
                <p style="margin: 10px 0;"><strong>Dates:</strong> ${start_date || '—'} — ${end_date || '—'}</p>
                <p style="margin: 10px 0;"><strong>Guests:</strong> ${num_guests || '—'}</p>
                <p style="margin: 10px 0;"><strong>Message:</strong> ${message || '—'}</p>
                <p style="margin: 10px 0;"><strong>Language:</strong> ${language}</p>
                <p style="margin-top: 30px; font-size: 10px; color: #555;">SWISSPERIENCES // ${new Date().toISOString()}</p>
            </div>
            `,
        });

        if (adminError) {
            console.error('[API] ❌ ADMIN EMAIL ERROR:', adminError);
            // CRITICAL: Throw error to trigger 500 response so frontend knows it failed
            // This prevents "silent failures" where user thinks it worked but we got nothing.
            throw new Error(`Failed to send admin notification: ${adminError.message}`);
        } else {
            console.log('[API] ✅ Admin notification sent successfully');
        }

        // 3. Sync to Resend Audiences (Automation)
        if (newsletter_opt_in && process.env.RESEND_AUDIENCE_ID) {
            await new Promise(resolve => setTimeout(resolve, 1100));
            try {
                await resend.contacts.create({
                    email: email,
                    audienceId: process.env.RESEND_AUDIENCE_ID,
                    unsubscribed: false,
                    firstName: first_name || undefined
                });
            } catch (syncError) {
                console.error('[API] Failed to sync contact:', syncError);
            }
        }

        return res.status(200).json({
            success: true,
            userMessageId: userData?.id,
            timestamp: new Date().toISOString()
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('💥 WAITLIST ERROR:', err.message);
        return res.status(500).json({
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
}
