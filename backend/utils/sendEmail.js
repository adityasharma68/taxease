// ─── utils/sendEmail.js ──────────────────────────────────────────────────────
// Nodemailer helper to send email notifications
// ─────────────────────────────────────────────────────────────────────────────

const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer
 * @param {Object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html    - HTML body of the email
 */
const sendEmail = async ({ to, subject, html }) => {
  // Create a transporter using SMTP credentials from .env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send the email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

/**
 * Pre-built: Send a deadline reminder email to a client
 */
const sendDeadlineReminder = async (user, filingType, dueDate) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #4f46e5; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">TaxEase</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1e293b;">⏰ Filing Deadline Reminder</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>This is a reminder that your <strong>${filingType}</strong> is due on <strong>${new Date(dueDate).toLocaleDateString("en-IN")}</strong>.</p>
        <p>Please ensure all required documents are uploaded to your dashboard.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="display:inline-block; background:#4f46e5; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; margin-top:16px;">
          Open Dashboard
        </a>
        <p style="color: #64748b; margin-top: 24px; font-size: 14px;">
          If you have already filed, please ignore this email.<br/>
          — The TaxEase Team
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Reminder: ${filingType} due on ${new Date(dueDate).toLocaleDateString("en-IN")}`,
    html,
  });
};

module.exports = { sendEmail, sendDeadlineReminder };
