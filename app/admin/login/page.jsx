'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('lewis@example.com');
  const [password, setPassword] = useState('12345');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) {
      setErr('Invalid credentials');
      setLoading(false);
      return;
    }
    router.push('/admin');
  }

  return (
    <section className="container py-10 max-w-md">
      <h1 className="text-xl font-semibold mb-4">Admin login</h1>
      <form onSubmit={submit} className="card space-y-3">
        <div>
          <label className="label">Email</label>
          <input
            className="input w-full"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input w-full"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button
          type="submit"
          className="button button--primary w-full"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
