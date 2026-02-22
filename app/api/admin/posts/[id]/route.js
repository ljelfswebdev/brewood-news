import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { requireAdmin } from '@helpers/auth';

export async function GET(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const doc = await Post.findById(params.id).lean();
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
  if (body.slug != null) {
    update.slug = String(body.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (body.postTypeKey != null) update.postTypeKey = String(body.postTypeKey);
  if (body.templateKey != null) update.templateKey = String(body.templateKey);
  if (body.status != null) update.status = String(body.status);
  if (body.publishedAt != null) update.publishedAt = new Date(body.publishedAt);
  if (body.sortOrder != null && Number.isFinite(Number(body.sortOrder))) {
    update.sortOrder = Number(body.sortOrder);
  }
  if (body.templateData != null) update.templateData = body.templateData;

  const doc = await Post.findByIdAndUpdate(params.id, update, { new: true }).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
