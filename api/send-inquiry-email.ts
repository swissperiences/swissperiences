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
<style>body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D2E; margin: 0; padding: 0; background-color: #F9FAFB; } .wrapper { width: 100%; padding: 40px 0; background-color: #F9FAFB; } .main { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border: 1px solid #eee; } h1 { font-weight: 300; font-size: 24px; margin-bottom: 20px; } p { line-height: 1.6; color: #444; margin-bottom: 15px; } .footer { font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }</style>
</head>
<body>
<div class="wrapper">
    <div class="main">
        <h1>Request Received</h1>
        <p>Dear ${contactName},</p>
        <p>Thank you for inquiring about Swissperiences for <strong>${companyName}</strong>.</p>
        <p>We have received your request. Our team will review your specific requirements and reach out shortly to discuss potential curations.</p>
        <p>If you have immediate questions, please simply reply to this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The Swissperiences Team</p>
        <div class="footer">
            © 2025 Swissperiences | Valais, Switzerland
        </div>
    </div>
</div>
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
