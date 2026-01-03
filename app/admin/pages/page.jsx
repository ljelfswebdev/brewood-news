'use client';

import useSWR from 'swr';
import Link from 'next/link';
import toast from 'react-hot-toast';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function AdminPagesList() {
  const { data, isLoading, mutate } = useSWR('/api/admin/pages', fetcher);

  async function createPage() {
    const title = prompt('Page title?');
    if (!title) return;
    const slug = prompt('Slug (url segment)?', title.toLowerCase().replace(/\s+/g,'-'));
    if (!slug) return;
    const r = await fetch('/api/admin/pages', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, title }),
    });
    if (!r.ok) return toast.error('Create failed');
    toast.success('Page created');
    mutate();
  }

  async function del(id) {
    if (!confirm('Delete this page?')) return;
    const r = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Deleted');
    mutate();
  }

  if (isLoading) return <div className="card">Loading…</div>;

  const rows = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pages</h2>
        <button className="button button--primary" onClick={createPage}>
          + New Page
        </button>
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Title</th>
              <th className="py-2">Slug</th>
              <th className="py-2">Template</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2">{p.title}</td>
                <td className="py-2">/{p.slug}</td>
                <td className="py-2 text-xs">{p.templateKey}</td>
                <td className="flex w-fit ml-auto">
                  <Link href={`/admin/pages/${p._id}`} className="button button--secondary">
                    Edit
                  </Link>
                  <button
                    className="button button--tertiary"
                    onClick={() => del(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500 text-sm">
                  No pages yet. Use "New Page" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
