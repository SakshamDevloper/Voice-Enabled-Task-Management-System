const nodemailer = require('nodemailer');

// Create reusable transporter (configured with SMTP settings or standard local logs fallback)
const createTransporter = async () => {
  // Use custom SMTP credentials if available in environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback: Generate Ethereal Email test account for development/demo purposes
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (err) {
    console.warn('Could not initialize Ethereal SMTP transporter. Falling back to mock console logger:', err.message);
    return null;
  }
};

exports.sendNotificationEmail = async (toEmail, title, message) => {
  try {
    const transporter = await createTransporter();
    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #2563eb; margin: 0;">🎙️ VoiceTask Manager</h2>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0;">Task Alerts & Reminders</p>
        </div>
        <div style="margin-bottom: 24px;">
          <h3 style="color: #0f172a; margin: 0 0 12px;">${title}</h3>
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0;">${message}</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">This is an automated notification. You are receiving this because you enabled email alerts for your tasks.</p>
        </div>
      </div>
    `;

    if (!transporter) {
      console.log(`[MOCK EMAIL SENT] To: ${toEmail} | Title: ${title} | Message: ${message}`);
      return;
    }

    const info = await transporter.sendMail({
      from: '"VoiceTask Alerts" <alerts@voicetask.com>',
      to: toEmail,
      subject: `[VoiceTask] ${title}`,
      text: `${title}\n\n${message}`,
      html: htmlContent
    });

    console.log(`Email notification successfully dispatched: ${info.messageId}`);
    
    // If using Ethereal, print preview link
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Ethereal Email Preview URL: ${previewUrl}`);
    }
  } catch (err) {
    console.error('Error dispatching notification email:', err.message);
  }
};
