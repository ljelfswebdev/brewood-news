// app/api/admin/menus/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import { requireAdmin } from '@helpers/auth';
import Menu from '@/models/Menu';

// GET /api/admin/menus → [menus...]
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const menus = await Menu.find().sort({ createdAt: 1 }).lean();
  return NextResponse.json(menus);
}

// POST /api/admin/menus → upsert a single menu by key
export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();
  const { key, label, items } = body || {};

  if (!key) {
    return NextResponse.json({ error: 'key is required' }, { status: 400 });
  }

  const doc = await Menu.findOneAndUpdate(
    { key },
    {
      key,
      label: label || key.replace(/[_-]+/g, ' '),
      items: Array.isArray(items) ? items : [],
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json(doc);
}