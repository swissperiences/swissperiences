import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { companyName, contactName, email, teamSize = "", message = "" } = req.body;

    try {
        // 1. Send confirmation to user (Institutional/Professional)
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: 'Swissperiences Team Inquiry Received',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Inquiry Received</title>
    <style>
        body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D2E; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #F9FAFB; padding-bottom: 40px; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1A1D2E; border: 1px solid #E5E7EB; border-radius: 2px; }
        .header-logo { text-align: center; padding: 40px 0 20px 0; font-size: 16px; letter-spacing: 3px; text-transform: uppercase; font-weight: 300; color: #1A1D2E; }
        .content { padding: 40px 50px; text-align: left; }
        h1 { font-size: 22px; font-weight: 300; margin-bottom: 25px; color: #1A1D2E; letter-spacing: -0.5px; }
        p { font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #4A4A4A; }
        .divider { height: 1px; background-color: #E5E7EB; margin: 30px 0; border: none; }
        .footer { text-align: center; padding: 30px 50px; font-size: 11px; color: #9CA3AF; letter-spacing: 1px; line-height: 1.8; background-color: #F9FAFB; border-top: 1px solid #E5E7EB; }
        .footer a { color: #1A1D2E; text-decoration: none; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <tr>
                <td class="header-logo">Swissperiences</td>
            </tr>
            <tr>
                <td class="content">
                    <h1>Inquiry Received</h1>
                    <p>Dear ${contactName},</p>
                    <p>Thank you for considering Swissperiences for <strong>${companyName}</strong>.</p>
                    <p>We have successfully received your inquiry. Our team is currently reviewing your team's requirements and the details you provided.</p>
                    <p>We design every retreat as a bespoke experience. A member of our curation team will reach out to you shortly to discuss how we can tailor a program for your team's goals.</p>
                    
                    <hr class="divider">
                    
                    <p style="margin-bottom: 0;">Warm regards,</p>
                    <p style="margin-top: 5px; font-weight: 500; color: #1A1D2E;">The Swissperiences Team</p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p>© 2025 SWISSPERIENCES | GENEVA, SWITZERLAND</p>
                    <p><a href="https://swissperiences.ch">WEBSITE</a> • <a href="mailto:hello@swissperiences.ch">CONTACT</a></p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`,
        });

        // 2. Internal Notification (Admin Template - Corporate Variant)
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: `New Lead – Swissperiences (Corporate: ${companyName})`,
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Swissperiences Admin Notification</title>
    <style>
        body { margin: 0; padding: 0; background-color: #FDFDFD; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1A1D2E; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #FDFDFD; padding: 40px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border: 1px solid #EEEEEE; border-radius: 2px; }
        .header { padding: 40px 50px; border-bottom: 1px solid #F5F5F5; }
        .status-badge { display: inline-block; background-color: #1A1D2E; color: #ffffff; font-size: 10px; padding: 4px 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; border-radius: 1px; margin-bottom: 15px; }
        .header-title { font-size: 22px; font-weight: 300; letter-spacing: -0.5px; color: #1A1D2E; }
        .content { padding: 40px 50px; }
        .data-table { width: 100%; margin-bottom: 40px; border-collapse: collapse; }
        .data-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888888; padding-bottom: 8px; font-weight: 600; }
        .data-value { font-size: 16px; color: #1A1D2E; padding-bottom: 25px; border-bottom: 1px solid #F5F5F5; }
        .message-box { background: #f9f9f9; padding: 20px; font-size: 14px; line-height: 1.6; color: #444; margin-top: 10px; border-left: 2px solid #D8B58A; }
        .action-row { padding-top: 20px; text-align: center; }
        .button { display: inline-block; padding: 14px 24px; text-decoration: none; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; transition: all 0.2s; }
        .btn-primary { background-color: #1A1D2E; color: #ffffff !important; margin-right: 10px; }
        .btn-secondary { border: 1px solid #EEEEEE; color: #1A1D2E !important; }
        .footer { padding: 40px; text-align: center; font-size: 9px; color: #BBBBBB; letter-spacing: 1.5px; text-transform: uppercase; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" width="100%">
            <tr>
                <td class="header">
                    <div class="status-badge">Corporate Lead</div>
                    <div class="header-title">New Team Inquiry</div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <table class="data-table">
                        <tr><td class="data-label">Company Name</td></tr>
                        <tr><td class="data-value">${companyName}</td></tr>
                        
                        <tr><td style="padding-top: 20px;" class="data-label">Contact Person</td></tr>
                        <tr><td class="data-value">${contactName}</td></tr>

                        <tr><td style="padding-top: 20px;" class="data-label">Email</td></tr>
                        <tr><td class="data-value">${email}</td></tr>

                        <tr><td style="padding-top: 20px;" class="data-label">Team Size</td></tr>
                        <tr><td class="data-value">${teamSize}</td></tr>

                        <tr><td style="padding-top: 20px;" class="data-label">Message</td></tr>
                        <tr><td><div class="message-box">${message}</div></td></tr>
                    </table>

                    <div class="action-row">
                        <a href="mailto:${email}" class="button btn-primary">Reply to Lead</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    Swissperiences System Notification<br>
                    <span style="color: #D8B58A;">Automated Confirmation Sent</span>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
