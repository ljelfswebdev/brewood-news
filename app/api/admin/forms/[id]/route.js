import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import { requireAdmin } from '@helpers/auth';
import Form from '@/models/Form';

export async function GET(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const doc = await Form.findById(params.id).lean();
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(doc);
}

export async function PATCH(req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();
  const { name, key, rows, autoReply } = body || {};

  if (!name || !key) {
    return NextResponse.json(
      { error: 'name and key are required' },
      { status: 400 }
    );
  }

  // check key uniqueness (excluding current doc)
  const existing = await Form.findOne({
    key,
    _id: { $ne: params.id },
  }).lean();
  if (existing) {
    return NextResponse.json(
      { error: 'A form with that key already exists' },
      { status: 409 }
    );
  }

  const update = { name, key };
  if (rows !== undefined) update.rows = rows;
  if (autoReply !== undefined) update.autoReply = autoReply;

  const doc = await Form.findByIdAndUpdate(params.id, update, {
    new: true,
  }).lean();

  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(doc);
}

export async function DELETE(_req, { params }) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  await Form.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}