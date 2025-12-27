import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // 1. Send confirmation to user (Editorial Welcome)
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: 'You’ve found your way in.',
            html: `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Welcome to Swissperiences</title> <style> body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1D2E; -webkit-font-smoothing: antialiased; } .wrapper { width: 100%; table-layout: fixed; background-color: #F9FAFB; padding-bottom: 60px; } .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1A1D2E; } .header-logo { text-align: center; padding: 45px 0; font-size: 18px; letter-spacing: 3px; text-transform: uppercase; font-weight: 300; } .hero-image { width: 100%; max-width: 600px; height: auto; display: block; } .content { padding: 50px 45px; text-align: left; } h1 { font-size: 26px; font-weight: 300; line-height: 1.4; margin-bottom: 25px; color: #1A1D2E; } p { font-size: 16px; line-height: 1.8; margin-bottom: 22px; color: #4A4A4A; } .philosophy-quote { border-left: 2px solid #D8B58A; padding-left: 25px; margin: 40px 0; font-style: italic; color: #1A1D2E; } .perks-list { padding: 0; margin: 0 0 40px 20px; color: #4A4A4A; line-height: 2; } .cta-button { display: inline-block; background-color: #1A1D2E; color: #ffffff !important; padding: 18px 35px; text-decoration: none; border-radius: 2px; font-size: 13px; letter-spacing: 2px; font-weight: 500; } .footer { text-align: center; padding: 40px; font-size: 11px; color: #999999; letter-spacing: 1px; line-height: 2; } .footer a { color: #1A1D2E; text-decoration: none; } </style> </head> <body> <center class="wrapper"> <table class="main" width="100%"> <tr><td class="header-logo">Swissperiences</td></tr> <tr> <td> <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop" alt="The Alps at Golden Hour" class="hero-image"> </td> </tr> <tr> <td class="content"> <h1>You’ve found your way in.</h1> <p>There are a thousand ways to visit Switzerland. You chose the quietest one.</p> <p>You have joined a small circle of travelers who understand that the best journeys aren't measured in destinations checked off a list—they are measured in moments of genuine stillness.</p> <div class="philosophy-quote"> "Switzerland is not a destination. It’s a state of mind." </div> <p><strong>As a Founding Member:</strong></p> <ul class="perks-list"> <li>Early access to invite-only experiences.</li> <li>Founding member pricing, locked in for your first journey.</li> <li>First look at new hosts and seasonal offerings.</li> </ul> <center> <a href="https://swissperiences.ch" class="cta-button">EXPLORE THE PHILOSOPHY</a> </center> <p style="margin-top: 50px; font-size: 14px; color: #888; text-align: center;"> We move intentionally here. We will reach out personally when your first invitation is ready. In the meantime, breathe. The mountains aren't going anywhere. </p> <p style="font-size: 14px; font-style: italic; color: #1A1D2E; text-align: center; margin-top: 20px;"> — The Swissperiences Team </p> </td> </tr> <tr> <td class="footer"> <p>© 2025 SWISSPERIENCES | VALAIS, SWITZERLAND</p> <p><a href="https://swissperiences.ch">WEBSITE</a> • <a href="mailto:hello@swissperiences.ch">CONTACT</a> • <a href="#">UNSUBSCRIBE</a></p> </td> </tr> </table> </center> </body> </html>`,
        });

        // 2. Internal Notification (Admin Template - Waitlist Variant)
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: 'New Lead – Swissperiences (Waitlist)',
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
        .status-badge { display: inline-block; background-color: #D8B58A; color: #ffffff; font-size: 10px; padding: 4px 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; border-radius: 1px; margin-bottom: 15px; }
        .header-title { font-size: 22px; font-weight: 300; letter-spacing: -0.5px; color: #1A1D2E; }
        .content { padding: 40px 50px; }
        .data-table { width: 100%; margin-bottom: 40px; border-collapse: collapse; }
        .data-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888888; padding-bottom: 8px; font-weight: 600; }
        .data-value { font-size: 16px; color: #1A1D2E; padding-bottom: 25px; border-bottom: 1px solid #F5F5F5; }
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
                    <div class="status-badge">New Lead</div>
                    <div class="header-title">Waitlist activity on swissperiences.ch</div>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <table class="data-table">
                        <tr><td class="data-label">Subscriber Email</td></tr>
                        <tr><td class="data-value">${email}</td></tr>
                        <tr><td style="padding-top: 25px;" class="data-label">Registration Time</td></tr>
                        <tr><td class="data-value">${new Date().toLocaleString()}</td></tr>
                    </table>

                    <div class="action-row">
                        <a href="https://supabase.com/dashboard/project/rhoxismvcalqppbnndew/editor" class="button btn-primary">Open Supabase</a>
                        <a href="mailto:${email}" class="button btn-secondary">Direct Email</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    Swissperiences System Notification<br>
                    <span style="color: #D8B58A;">Automated Welcome Email Sent Successfully</span>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`,
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
