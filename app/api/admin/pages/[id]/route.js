// app/api/admin/pages/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import { requireAdmin } from '@helpers/auth';

export async function GET(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const doc = await Page.findById(params.id).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const body = await req.json();
  const update = {};

  if (body.title != null) update.title = String(body.title);
  if (body.slug != null) update.slug = String(body.slug).replace(/^\//, '');
  if (body.templateKey != null) update.templateKey = String(body.templateKey);
  if (body.body != null) update.body = String(body.body);
  if (body.templateData != null) update.templateData = body.templateData;

  const doc = await Page.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}