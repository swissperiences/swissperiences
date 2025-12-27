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
        const data = await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: [email],
            subject: 'Your Request to Swissperiences',
            html: `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <h1>Request Received</h1>
          <p>Thank you for your interest in Swissperiences.</p>
          <p>We have received your request for access. As we curate each journey personally, we review every applicant individually.</p>
          <p>You can expect to hear from us within 48 hours.</p>
          <br/>
          <p>Warm regards,</p>
          <p>The Swissperiences Team</p>
        </div>
      `,
        });

        // 2. Internal Notification
        await resend.emails.send({
            from: 'Swissperiences <hello@swissperiences.ch>',
            to: ['hello@swissperiences.ch'],
            subject: 'New Lead – Swissperiences (Waitlist)',
            html: `
                <div style="font-family: sans-serif;">
                    <h1>New Waitlist Request</h1>
                    <p><strong>Email:</strong> ${email}</p>
                </div>
            `,
        });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
