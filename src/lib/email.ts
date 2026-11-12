import nodemailer from 'nodemailer';

interface HireRequest {
  id: string;
  client_name: string;
  email: string;
  company?: string;
  project_type: string;
  budget_range: string;
  description: string;
  deadline: string;
  created_at: string;
}

interface DonationInfo {
  id: string;
  donor_name?: string;
  amount_usd: number;
  currency: string;
  network: string;
  created_at: string;
}

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Sends a hire request notification to the admin.
 * Silently skips if SMTP is not configured.
 */
export async function sendHireRequestNotification(hireRequest: HireRequest): Promise<void> {
  const transporter = createTransport();
  if (!transporter) {
    console.log('[Email] SMTP not configured — skipping hire request notification');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  try {
    await transporter.sendMail({
      from: `"ONE DOLLAR PROJECT" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🎯 New Hire Request from ${hireRequest.client_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #F59E0B;">New Hire Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; color: #9CA3AF;">Name:</td><td style="padding: 8px;">${hireRequest.client_name}</td></tr>
            <tr><td style="padding: 8px; color: #9CA3AF;">Email:</td><td style="padding: 8px;">${hireRequest.email}</td></tr>
            ${hireRequest.company ? `<tr><td style="padding: 8px; color: #9CA3AF;">Company:</td><td style="padding: 8px;">${hireRequest.company}</td></tr>` : ''}
            <tr><td style="padding: 8px; color: #9CA3AF;">Project Type:</td><td style="padding: 8px;">${hireRequest.project_type}</td></tr>
            <tr><td style="padding: 8px; color: #9CA3AF;">Budget:</td><td style="padding: 8px;">${hireRequest.budget_range}</td></tr>
            <tr><td style="padding: 8px; color: #9CA3AF;">Deadline:</td><td style="padding: 8px;">${hireRequest.deadline}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #1a1a1a; border-radius: 4px; border-left: 3px solid #F59E0B;">
            <strong>Description:</strong><br/>
            <p style="margin-top: 8px;">${hireRequest.description}</p>
          </div>
          <p style="color: #6B7280; font-size: 12px; margin-top: 16px;">Request ID: ${hireRequest.id} | Submitted: ${new Date(hireRequest.created_at).toLocaleString()}</p>
        </div>
      `,
    });
    console.log('[Email] Hire request notification sent');
  } catch (error) {
    console.error('[Email] Failed to send hire request notification:', error);
  }
}

/**
 * Sends a donation confirmation to the donor.
 * Silently skips if SMTP is not configured or email not provided.
 */
export async function sendDonationConfirmation(
  donation: DonationInfo,
  recipientEmail: string
): Promise<void> {
  const transporter = createTransport();
  if (!transporter || !recipientEmail) {
    console.log('[Email] SMTP not configured or no email — skipping donation confirmation');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"ONE DOLLAR PROJECT" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `✅ Your $${donation.amount_usd} donation is being verified`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #ffffff; padding: 24px; border-radius: 8px;">
          <h2 style="color: #F59E0B;">Thank You for Your Support! 🙏</h2>
          <p>Your donation has been received and is pending admin verification.</p>
          <div style="padding: 16px; background: #1a1a1a; border-radius: 8px; border: 1px solid #374151; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Amount:</strong> $${donation.amount_usd} USD</p>
            <p style="margin: 4px 0;"><strong>Currency:</strong> ${donation.currency} (${donation.network})</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #F59E0B;">Pending Verification</span></p>
            <p style="margin: 4px 0;"><strong>Reference:</strong> ${donation.id}</p>
          </div>
          <p style="color: #9CA3AF;">Once an admin verifies your transaction on the blockchain, your donation will be marked as confirmed.</p>
          <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">ONE DOLLAR PROJECT — One Dollar. One Dream. Millions of Possibilities.</p>
        </div>
      `,
    });
    console.log('[Email] Donation confirmation sent');
  } catch (error) {
    console.error('[Email] Failed to send donation confirmation:', error);
  }
}
