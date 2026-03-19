import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();
import { checkRateLimit } from './lib/rate-limit.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    const allowedOrigins = ['https://swissperiences.ch', 'https://www.swissperiences.ch'];
    const origin = req.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    if (!process.env.RESEND_API_KEY) {
        return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    }

    // Rate limit: 5 per hour per IP
    const clientIp = req.headers['x-forwarded-for'] as string || 'anonymous';
    const rateLimitResult = await checkRateLimit(clientIp, 'guide');
    if (!rateLimitResult.success) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { email } = req.body;
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: email,
            subject: 'Your Swiss Insider Guide is here',
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#000000;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;">
    <tr>
      <td align="center" style="padding:60px 20px;">
        <table width="560" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;text-align:center;">
              <span style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#666666;">SWISSPERIENCES</span>
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;font-family:Georgia,serif;line-height:1.2;">
                Your Swiss Insider Guide
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;color:#999999;font-size:16px;line-height:1.6;">
              Thanks for joining our community. Here's your free guide with 30+ hidden gems across Switzerland &mdash; places most tourists never discover.
            </td>
          </tr>
          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom:40px;text-align:center;">
              <a href="https://swissperiences.ch/insider-guide.pdf"
                 style="display:inline-block;padding:16px 40px;background-color:#2E9090;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;letter-spacing:0.5px;">
                Download the Guide
              </a>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding-bottom:32px;">
              <hr style="border:none;border-top:1px solid #1a1a1a;margin:0;">
            </td>
          </tr>
          <!-- Upsell -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;color:#666666;font-size:14px;line-height:1.6;">
              Want the full curated experience? We plan personalized Swiss trips for our private community of travelers.
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:40px;text-align:center;">
              <a href="https://swissperiences.ch/request-access"
                 style="display:inline-block;padding:12px 32px;border:1px solid #333333;color:#ffffff;text-decoration:none;font-size:13px;font-weight:500;border-radius:8px;">
                Learn about membership
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align:center;color:#444444;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
              swissperiences.ch
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `.trim(),
        });

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Guide email error:', error);
        return res.status(500).json({ error: 'Failed to send guide email' });
    }
}
