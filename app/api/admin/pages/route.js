// app/api/admin/pages/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import { requireAdmin } from '@helpers/auth';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  await dbConnect();
  const items = await Page.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const body = await req.json();

  const slug = String(body.slug || '').trim();
  const title = String(body.title || 'Untitled').trim();
  const templateKey = String(body.templateKey || 'default');
  const templateData = body.templateData || {};
  const pageBody = String(body.body || '');

  const doc = await Page.create({
    slug,
    title,
    templateKey,
    templateData,
    body: pageBody,
  });

  return NextResponse.json(doc);
}