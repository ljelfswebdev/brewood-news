// app/admin/post-types/page.jsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PostTypesList() {
  const { data, isLoading, mutate } = useSWR('/api/admin/post-types', fetcher);

  async function createPostType() {
    const label = prompt('Post type label? (e.g. News)');
    if (!label) return;
    const key =
      prompt('Key (url segment, e.g. news)', label.toLowerCase().replace(/\s+/g, '-')) ||
      '';
    if (!key) return;

    const templateKey = prompt(
      `Template key? Available: ${Object.keys(POST_TYPE_TEMPLATES).join(', ')}`,
      'news'
    );
    if (!templateKey) return;

    const r = await fetch('/api/admin/post-types', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key, label, templateKey }),
    });
    if (!r.ok) {
      toast.error('Create failed');
      return;
    }
    toast.success('Post type created');
    mutate();
  }

  async function del(id) {
    if (!confirm('Delete this post type? (posts will NOT be auto deleted yet)')) return;
    const r = await fetch(`/api/admin/post-types/${id}`, { method: 'DELETE' });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Deleted');
    mutate();
  }

  if (isLoading) return <div className="card">Loading…</div>;

  const rows = data?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Post Types</h2>
        <button className="button button--primary" onClick={createPostType}>
          + New Post Type
        </button>
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Label</th>
              <th className="py-2">Key</th>
              <th className="py-2">Template</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="py-2">{t.label}</td>
                <td className="py-2">{t.key}</td>
                <td className="py-2 text-xs">{t.templateKey}</td>
                <td className="flex w-fit ml-auto">
                  <Link
                    href={`/admin/post-types/${t._id}`}
                    className="button button--secondary"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/posts?type=${t.key}`}
                    className="button button--secondary"
                  >
                    View Posts
                  </Link>
                  <button
                    className="button button--tertiary"
                    onClick={() => del(t._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500 text-sm">
                  No post types yet. Use “New Post Type” to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
