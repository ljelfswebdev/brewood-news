import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import { requireAdmin } from '@helpers/auth';
import Form from '@/models/Form';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const items = await Form.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();
  const { name, key, rows = [], autoReply = {} } = body || {};

  if (!name || !key) {
    return NextResponse.json(
      { error: 'name and key are required' },
      { status: 400 }
    );
  }

  const existing = await Form.findOne({ key }).lean();
  if (existing) {
    return NextResponse.json(
      { error: 'A form with that key already exists' },
      { status: 409 }
    );
  }

  const doc = await Form.create({
    name,
    key,
    rows,
    autoReply,
  });

  return NextResponse.json(
    { _id: doc._id, name: doc.name, key: doc.key },
    { status: 201 }
  );
}