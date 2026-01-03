// app/api/admin/forms/submit/route.js
import { NextResponse } from 'next/server';
import { requireAdmin } from '@helpers/auth';
import { dbConnect } from '@helpers/db';
import Form from '@/models/Form';
import FormSubmission from '@/models/FormSubmission';
import { sendBasicMail } from '@helpers/mailer';

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();
  const { formKey, data } = body || {};

  if (!formKey) {
    return NextResponse.json({ error: 'formKey is required' }, { status: 400 });
  }

  const form = await Form.findOne({ key: formKey }).lean();
  if (!form) {
    return NextResponse.json({ error: 'Form not found' }, { status: 404 });
  }

  const submission = await FormSubmission.create({
    formKey,
    data: data || {},
    meta: { fromAdmin: true },
  });

  try {
    const to = process.env.SMTP_USER || process.env.SMTP_FROM;
    if (to) {
      const subject = `Admin test submission: ${form.name || form.key}`;
      const htmlLines = Object.entries(data || {}).map(([k, v]) => {
        const value = Array.isArray(v) ? v.join(', ') : v;
        return `<p><strong>${k}</strong>: ${String(value)}</p>`;
      });
      await sendBasicMail({
        to,
        subject,
        html: htmlLines.join(''),
      });
    }
  } catch (err) {
    console.error('Admin form email failed:', err?.message || err);
  }

  return NextResponse.json({ ok: true, id: submission._id });
}