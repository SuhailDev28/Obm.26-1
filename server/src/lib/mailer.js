// server/src/lib/mailer.js
import nodemailer from "nodemailer";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactInquiryEmail({ to, subject, contactMessage }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("SMTP not configured. Skipping contact email.");
    return {
      sent: false,
      reason: "SMTP_NOT_CONFIGURED",
    };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">New Website Inquiry</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Name:</td>
          <td style="padding: 8px 0;">${escapeHtml(contactMessage.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;">${escapeHtml(contactMessage.email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Company:</td>
          <td style="padding: 8px 0;">${escapeHtml(contactMessage.companyName || "-")}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Service:</td>
          <td style="padding: 8px 0;">${escapeHtml(contactMessage.serviceType || "-")}</td>
        </tr>
      </table>

      <h3 style="margin: 20px 0 8px;">Message</h3>
      <div style="white-space: pre-line; padding: 14px; background: #f4f4f5; border-radius: 10px;">
        ${escapeHtml(contactMessage.message)}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: contactMessage.email,
    subject,
    html,
  });

  return {
    sent: true,
  };
}