// app/api/admin/post-types/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import PostType from '@/models/PostType';
import { requireAdmin } from '@helpers/auth';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const items = await PostType.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });

  await dbConnect();
  const body = await req.json();
  const key = String(body.key || '').trim().toLowerCase();
  const label = String(body.label || '').trim();
  const templateKey = String(body.templateKey || '').trim();

  const doc = await PostType.create({ key, label, templateKey });
  return NextResponse.json(doc);
}