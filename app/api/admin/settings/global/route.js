// app/api/admin/settings/global/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import { requireAdmin } from '@helpers/auth';
import Setting from '@/models/Settings';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const doc = await Setting.findOne({ key: 'global' }).lean();

  // If nothing saved yet, return an empty shell so the UI can still render
  if (!doc) {
    return NextResponse.json({
      key: 'global',
      templateKey: 'global',
      templateData: {},
    });
  }

  return NextResponse.json(doc);
}

export async function PATCH(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();
  const templateData = body?.templateData || {};

  const doc = await Setting.findOneAndUpdate(
    { key: 'global' },
    {
      key: 'global',
      templateKey: 'global',
      templateData,
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json(doc);
}