import { Resend } from 'resend';
// import { checkRateLimit } from './lib/rate-limit.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { companyName, contactName, email, teamSize = "", message = "" } = req.body;

    // Rate limiting check - TEMPORARILY DISABLED due to Redis env var issue
    // const rateLimitResult = await checkRateLimit(email, 'corporate');
    // if (!rateLimitResult.success) {
    //     return res.status(429).json({ error: rateLimitResult.error });
    // }

    try {
        // 1. Send confirmation to USER (The "Professional Stunning")
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: 'Your team inquiry received.',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inquiry Received</title>
    <style>
        body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1A1D2E; }
        .wrapper { width: 100%; background-color: #F9FAFB; padding: 40px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        
        .hero-img { width: 100%; height: 280px; object-fit: cover; background-color: #1A1D2E; }
        
        .logo-area { text-align: center; padding: 40px 0 10px; }
        .logo-text { font-size: 14px; letter-spacing: 4px; text-transform: uppercase; color: #1A1D2E; font-weight: 400; }
        
        .content { padding: 40px 60px 60px; text-align: center; }
        
        h1 { font-family: 'Times New Roman', Times, serif; font-size: 32px; font-weight: 400; font-style: italic; margin-bottom: 30px; color: #1A1D2E; line-height: 1.2; }
        p { font-size: 15px; line-height: 1.8; color: #555555; margin-bottom: 24px; font-weight: 300; }
        
        .divider-small { width: 40px; height: 1px; background-color: #D8B58A; margin: 30px auto; border: none; }
        
        .details-box { background-color: #FAFAFA; padding: 30px; margin-top: 40px; text-align: left; border-left: 2px solid #D8B58A; }
        .detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 5px; display: block; }
        .detail-value { font-size: 14px; color: #1A1D2E; font-weight: 500; }
        
        .footer { background-color: #1A1D2E; color: #666; padding: 40px; text-align: center; font-size: 11px; letter-spacing: 1px; }
        .footer a { color: #888; text-decoration: none; border-bottom: 1px solid #444; padding-bottom: 2px; transition: color 0.2s; }
        .footer a:hover { color: #fff; border-color: #fff; }
        
        @media only screen and (max-width: 600px) {
            .content { padding: 30px 25px; }
            h1 { font-size: 28px; }
            .hero-img { height: 200px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <center>
            <div class="main">
                <!-- Hero Image: Team contemplating Matterhorn at sunset -->
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop" alt="Team Retreat at Matterhorn" class="hero-img">
                
                <div class="logo-area">
                    <div class="logo-text">Swissperiences</div>
                </div>
                
                <div class="content">
                    <h1>The journey begins.</h1>
                    
                    <p>Dear ${contactName},</p>
                    <p>We have received your inquiry for <strong>${companyName}</strong>.</p>
                    <p>True clarity is rarely found in the noise of the day-to-day. It is found in the silence of the Alps, in the pause between moments.</p>
                    <p>Our curation team is reviewing your requirements. We will design a proposal that aligns with your team's intent and goals.</p>
                    
                    <hr class="divider-small">
                    
                    <p style="font-size: 13px; color: #888; margin-top: 30px;">You entered the following details:</p>
                    
                    <div class="details-box">
                        <span class="detail-label">TEAM SIZE</span>
                        <div class="detail-value" style="margin-bottom: 20px;">${teamSize}</div>
                        
                        <span class="detail-label">VISION / MESSAGE</span>
                        <div class="detail-value">${message || "No specific message provided."}</div>
                    </div>
                </div>
                
                <div class="footer">
                     <p>© 2025 SWISSPERIENCES • GENEVA, SWITZERLAND</p>
                     <p><a href="https://swissperiences.ch">WEBSITE</a> &nbsp;&nbsp; <a href="mailto:hello@swissperiences.ch">CONTACT</a></p>
                </div>
            </div>
        </center>
    </div>
</body>
</html>`
        });

        // 2. Internal Notification to ADMIN (The "Intelligence Report")
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `[INTEL] New Corp Inquiry: ${companyName}`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Intelligence Report</title>
    <style>
        body { background-color: #1A1D2E; color: #E5E7EB; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 40px 20px; }
        .intel-card { background-color: #11131F; max-width: 500px; margin: 0 auto; border: 1px solid #333; border-top: 4px solid #D8B58A; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
        .title { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #fff; font-weight: 700; }
        .badge { background: #D8B58A; color: #000; font-size: 10px; padding: 4px 8px; font-weight: bold; border-radius: 2px; }
        .data-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #333; padding-bottom: 5px; }
        .label { color: #6B7280; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .value { color: #F3F4F6; font-size: 13px; font-weight: 500; text-align: right; }
        .message-block { background: #000; padding: 15px; margin-top: 20px; font-size: 12px; line-height: 1.5; color: #D1D5DB; border-left: 2px solid #555; }
        .footer { margin-top: 30px; font-size: 10px; color: #4B5563; text-align: center; letter-spacing: 1px; }
        .action-link { display: block; text-align: center; margin-top: 25px; color: #D8B58A; text-decoration: none; font-size: 12px; border: 1px solid #D8B58A; padding: 10px; transition: all 0.2s; }
        .action-link:hover { background: #D8B58A; color: #000; }
    </style>
</head>
<body>
    <div class="intel-card">
        <div class="header">
            <span class="title">New Inquiry</span>
            <span class="badge">CORPORATE</span>
        </div>
        
        <div class="data-row">
            <span class="label">Organization</span>
            <span class="value">${companyName}</span>
        </div>
        <div class="data-row">
            <span class="label">Point of Contact</span>
            <span class="value">${contactName}</span>
        </div>
        <div class="data-row">
            <span class="label">Email Frequency</span>
            <span class="value">${email}</span>
        </div>
        <div class="data-row">
            <span class="label">Est. Cohort</span>
            <span class="value">${teamSize}</span>
        </div>
        
        <div class="label" style="margin-top: 20px;">Briefing / Intent</div>
        <div class="message-block">
            "${message}"
        </div>
        
        <a href="mailto:${email}" class="action-link">:: INITIATE CONTACT ::</a>
        
        <div class="footer">
            SECURE TRANSMISSION // ${new Date().toISOString().split('T')[0]}<br>
            SWISSPERIENCES INTELLIGENCE UNIT
        </div>
    </div>
</body>
</html>`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
