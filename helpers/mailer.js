import nodemailer from 'nodemailer';

export function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP env vars not set');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendBasicMail({ to, subject, html }) {
  const transporter = createTransport();
  const from = process.env.SMTP_FROM || 'Website <no-reply@example.com>';
  await transporter.sendMail({ from, to, subject, html });
}
