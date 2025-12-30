import { Resend } from 'resend';
import { checkRateLimit } from './lib/rate-limit.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(email, 'waitlist');
    if (!rateLimitResult.success) {
        return res.status(429).json({ error: rateLimitResult.error });
    }

    try {
        // 1. Send confirmation to user (Editorial Welcome - Refined "Manifesto")
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: 'You’ve found your way in.',
            html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Welcome to Swissperiences</title> <style> body { margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D2E; -webkit-font-smoothing: antialiased; } .wrapper { width: 100%; table-layout: fixed; background-color: #FAFAFA; padding: 60px 0; } .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 580px; border-spacing: 0; color: #1A1D2E; box-shadow: 0 20px 40px rgba(0,0,0,0.03); padding: 60px 50px; text-align: center; } .header-logo { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; font-weight: 400; color: #1A1D2E; margin-bottom: 50px; display: block; } .hero-image { width: 100%; height: auto; display: block; margin-bottom: 50px; filter: contrast(1.05); } h1 { font-family: 'Times New Roman', Times, serif; font-size: 34px; font-weight: 400; font-style: italic; line-height: 1.25; margin-bottom: 30px; color: #1A1D2E; } p { font-size: 15px; line-height: 1.8; margin-bottom: 22px; color: #555; font-weight: 300; text-align: left; } .quote-box { margin: 40px 0; padding: 30px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; } .quote { font-family: 'Times New Roman', Times, serif; font-style: italic; font-size: 20px; color: #1A1D2E; margin: 0; } .perks-list { text-align: left; padding-left: 20px; margin: 40px 0; color: #444; } .perks-list li { margin-bottom: 10px; font-size: 14px; } .footer { margin-top: 60px; font-size: 11px; color: #999; letter-spacing: 1px; text-transform: uppercase; } .footer a { color: #1A1D2E; text-decoration: none; border-bottom: 1px solid #eee; } </style> </head> <body> <center class="wrapper"> <div class="main"> <span class="header-logo">Swissperiences</span> <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop" alt="The Matterhorn" class="hero-image"> <h1>You have found<br>your way in.</h1> <p>There are a thousand ways to visit Switzerland. You chose the quietest one.</p> <p>You have joined a small circle of travelers who understand that the best journeys aren't measured in destinations checked off a list—they are measured in moments of genuine stillness.</p> <div class="quote-box"> <p class="quote">Switzerland.<br>A state of mind.</p> </div> <p style="font-weight: 500; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: #D8B58A; margin-top: 40px;">Founding Member Privileges</p> <ul class="perks-list"> <li>Access to invite-only, seasonal experiences.</li> <li>Preferred pricing, locked in for your first journey.</li> <li>Personal stories from our local hosts.</li> </ul> <p style="margin-top: 50px; font-size: 13px; color: #888; text-align: center;"> We move intentionally here. We will reach out personally when your first invitation is ready. In the meantime, breathe. </p> <div class="footer"> © 2025 Swissperiences • Geneva, Switzerland<br><br> <a href="https://swissperiences.ch">Website</a> &nbsp; <a href="mailto:hello@swissperiences.ch">Contact</a> </div> </div> </center> </body> </html>`,
        });

        // 2. Internal Notification (The "Intelligence Report" - Waitlist Variant)
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
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
        
        <a href="mailto:${email}" class="action-link">:: ACKNOWLEDGE SIGNAL ::</a>
        
        <div class="footer">
            SECURE TRANSMISSION // ${new Date().toISOString().split('T')[0]}<br>
            SWISSPERIENCES INTELLIGENCE UNIT
        </div>
    </div>
</body>
</html>`,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
