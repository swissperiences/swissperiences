import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyName, contactName, email, teamSize, message } = req.body;

  try {
    // 1. Send confirmation to user
    await resend.emails.send({
      from: 'Swissperiences <hello@swissperiences.ch>',
      to: [email],
      subject: 'Swissperiences Team Inquiry Received',
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <p>Dear ${contactName},</p>
          <p>Thank you for contacting Swissperiences for your team.</p>
          <p>We have received your inquiry for <strong>${companyName}</strong>. Our team is reviewing your requirements and will reach out shortly to discuss potential curations.</p>
          <br/>
          <p>Best regards,</p>
          <p>The Swissperiences Team</p>
        </div>
      `,
    });

    // 2. Send notification to admin (using same sender for verify purposes usually, or separate admin email)
    // For now, we'll just log or assume the database entry is the primary admin record, 
    // but typically we'd send an admin alert too. 
    // Adding admin alert block:
    await resend.emails.send({
      from: 'Swissperiences System <system@swissperiences.ch>',
      to: ['concierge@swissperiences.ch'], // Replace with actual admin email if known, or keep generic
      subject: `New Corporate Inquiry: ${companyName}`,
      html: `
          <h1>New Team Inquiry</h1>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Contact:</strong> ${contactName} (${email})</p>
          <p><strong>Size:</strong> ${teamSize}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
