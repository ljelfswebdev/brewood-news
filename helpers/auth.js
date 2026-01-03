import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { dbConnect } from './db';
import User from '@/models/User';

const COOKIE_NAME = 'brochure_admin';

export async function seedAdminIfNeeded() {
  await dbConnect();
  const email = process.env.ADMIN_SEED_EMAIL || 'lewis@example.com';
  const plain = process.env.ADMIN_SEED_PASSWORD || '12345';

  const existing = await User.findOne({ email });
  if (existing) return;
  const hash = await bcrypt.hash(plain, 10);
  await User.create({ email, passwordHash: hash, role: 'admin' });
}

export async function login(email, password) {
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  const value = JSON.stringify({ id: user._id.toString(), role: user.role, email: user.email });
  cookies().set(COOKIE_NAME, value, { httpOnly: true, sameSite: 'lax', path: '/' });
  return { id: user._id.toString(), role: user.role, email: user.email };
}

export async function logout() {
  cookies().set(COOKIE_NAME, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function requireAdmin() {
  const u = await getCurrentUser();
  if (!u || (u.role !== 'admin' && u.role !== 'editor')) {
    return { ok: false, status: 401, error: 'Unauthorised' };
  }
  return { ok: true, user: u };
}
