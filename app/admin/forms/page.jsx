// app/admin/forms/page.jsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import toast from 'react-hot-toast';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function FormsAdminList() {
  const { data, isLoading, mutate } = useSWR('/api/admin/forms', fetcher);

  async function deleteForm(id) {
    if (!confirm('Delete this form?')) return;
    const r = await fetch(`/api/admin/forms/${id}`, { method: 'DELETE' });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Form deleted');
    mutate();
  }

  if (isLoading) return <div className="card">Loading…</div>;

  const items = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Forms</h2>
        <Link href="/admin/forms/create" className="button button--primary">
          + New form
        </Link>
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Key</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f._id} className="border-t">
                <td className="py-2">{f.name}</td>
                <td className="py-2">
                  <code>{f.key}</code>
                </td>
                <td className="flex w-fit ml-auto">
                  <Link
                    href={`/admin/forms/${f._id}`}
                    className="button button--secondary text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    className="button button--tertiary text-xs"
                    onClick={() => deleteForm(f._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td
                  colSpan={3}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No forms yet. Click &ldquo;New form&rdquo; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}