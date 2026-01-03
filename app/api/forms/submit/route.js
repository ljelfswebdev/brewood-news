import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Form from '@/models/Form';
import Submission from '@/models/FormSubmission'; // if you have this
import { sendBasicMail } from '@helpers/mailer';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Support either { formKey, values } or { formKey, payload }
    const formKey = body.formKey;
    const values = body.values || body.payload || {};

    if (!formKey) {
      return NextResponse.json(
        { error: 'formKey is required' },
        { status: 400 }
      );
    }

    const form = await Form.findOne({ key: formKey }).lean();
    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    // Optional: store submission in DB
    try {
      if (Submission) {
        await Submission.create({
          formKey,
          values,
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.warn('Failed to save submission', e);
    }

    // ---- Build admin email HTML from submitted values ----
    const rowsHtml = Object.entries(values || {})
      .map(([label, val]) => {
        return `
          <tr>
            <td style="padding:4px 8px; border:1px solid #ddd;"><strong>${escapeHtml(
              label
            )}</strong></td>
            <td style="padding:4px 8px; border:1px solid #ddd;">${escapeHtml(
              val
            )}</td>
          </tr>
        `;
      })
      .join('');

    const adminSubject =
      `New submission: ${form.name || form.key}`.trim();

    const adminHtml = `
      <p>You have a new submission from <strong>${escapeHtml(
        form.name || form.key
      )}</strong>.</p>
      ${
        rowsHtml
          ? `<table cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-size:14px; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>`
          : '<p><em>No form values submitted.</em></p>'
      }
    `;

    const adminTo =
      process.env.FORM_ADMIN_TO ||
      process.env.SMTP_USER ||
      process.env.SMTP_FROM;

    if (adminTo) {
      await sendBasicMail({
        to: adminTo,
        subject: adminSubject,
        html: adminHtml,
      });
    }

    // ---- Auto-reply (to user) ----
    const auto = form.autoReply || {};
    if (auto.enabled) {
      // Try to detect the user's email from submitted values.
      // This assumes your front-end uses the field label as the key,
      // e.g. { "Email Address": "user@site.com" }
      let userEmail = null;

      for (const [label, val] of Object.entries(values || {})) {
        const l = label.toLowerCase();
        if (
          l.includes('email') ||
          l === 'email' ||
          l === 'your email'
        ) {
          userEmail = val;
          break;
        }
      }

      if (userEmail) {
        const replySubject = auto.subject || 'Thank you for your message';

        // support newlines in message
        const replyMessage = (auto.message || '')
          .split('\n')
          .map(escapeHtml)
          .join('<br />');

        const fromName  = process.env.SMTP_FROM || 'Website <no-reply@example.com>';
        const fromEmail = auto.fromEmail || process.env.SMTP_FROM;

        // We reuse sendBasicMail, which sets "from" from SMTP_FROM.
        // If you really need custom fromName/fromEmail, you can extend helper,
        // but this will work with your existing helper.
        await sendBasicMail({
          to: userEmail,
          subject: replySubject,
          html: replyMessage || '<p>Thank you for your message.</p>',
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Form submit failed' },
      { status: 500 }
    );
  }
}