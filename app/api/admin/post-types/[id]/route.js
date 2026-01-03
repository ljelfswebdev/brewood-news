// app/api/admin/post-types/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import PostType from '@/models/PostType';
import { requireAdmin } from '@helpers/auth';

export async function GET(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const doc = await PostType.findById(params.id).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const body = await req.json();
  const update = {};
  if (body.label != null) update.label = String(body.label).trim();
  if (body.key != null) update.key = String(body.key).trim().toLowerCase();
  if (body.templateKey != null) update.templateKey = String(body.templateKey).trim();

  const doc = await PostType.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  await PostType.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}