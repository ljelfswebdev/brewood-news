import { NextResponse } from 'next/server';
import { login, seedAdminIfNeeded } from '@helpers/auth';

export async function POST(req) {
  await seedAdminIfNeeded();
  const body = await req.json();
  const { email, password } = body || {};
  const u = await login(email, password);
  if (!u) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: u });
}
