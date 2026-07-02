import nodemailer from 'nodemailer';

/**
 * Thin SMTP mailer, gated entirely by env vars. If SMTP_HOST is unset the
 * caller's notification is a no-op (logged, not sent) — this lets status-
 * change hooks call sendStatusEmail() unconditionally without needing a
 * real mail provider configured yet. Set SMTP_HOST/PORT/USER/PASSWORD/FROM
 * in .env to make it real.
 */
let cachedTransporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  cachedTransporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
  return cachedTransporter;
}

export async function sendStatusEmail(
  strapi: { log: { info: (m: string) => void; error: (m: string) => void } },
  to: string,
  subject: string,
  text: string
) {
  const transporter = getTransporter();
  if (!transporter) {
    strapi.log.info(`[mailer] SMTP not configured — skipping email to ${to}: "${subject}"`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'no-reply@halalsgm.vn',
      to,
      subject,
      text,
    });
    strapi.log.info(`[mailer] Sent "${subject}" to ${to}`);
  } catch (err) {
    strapi.log.error(`[mailer] Failed to send email to ${to}: ${err}`);
  }
}
