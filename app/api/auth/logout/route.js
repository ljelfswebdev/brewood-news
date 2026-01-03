import { NextResponse } from 'next/server';
import { logout } from '@helpers/auth';

export async function POST() {
  await logout();
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return NextResponse.redirect(base + '/admin/login');
}
