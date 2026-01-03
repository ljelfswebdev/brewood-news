// app/admin/posts/page.jsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminPostsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postTypeKey = searchParams.get('type') || '';

  const { data, isLoading, mutate } = useSWR(
    `/api/admin/posts${postTypeKey ? `?type=${postTypeKey}` : ''}`,
    fetcher
  );

  async function createPost() {
    if (!postTypeKey) {
      alert('Pick a post type via ?type=news etc or use the Post Types page.');
      return;
    }
    router.push(`/admin/posts/new?type=${postTypeKey}`);
  }

  async function del(id) {
    if (!confirm('Delete this post?')) return;
    try {
      const r = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(await r.text());
      toast.success('Post deleted');
      mutate();
    } catch (e) {
      toast.error(e.message || 'Delete failed');
    }
  }

  if (isLoading) return <div className="card">Loading…</div>;

  const rows = data?.items || [];
  const typeLabel = data?.postType?.label || postTypeKey || 'All';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Posts {postTypeKey ? `— ${typeLabel}` : ''}
        </h2>
        <button className="button button--primary" onClick={createPost}>
          + New Post
        </button>
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Title</th>
              <th className="py-2">URL</th>
              <th className="py-2">Type</th>
              <th className="py-2">Published</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2">{p.title}</td>
                <td className="py-2">
                  <a
                    href={p.path}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {p.path}
                  </a>
                </td>
                <td className="py-2 text-xs">{p.postTypeKey}</td>
                <td className="py-2 text-xs">
                  {p.publishDate
                    ? new Date(p.publishDate).toLocaleDateString()
                    : '—'}
                </td>
                <td className="py-2">
                  <div className="flex gap-2 justify-end">
                    <Link
                      href={`/admin/posts/${p._id}`}
                      className="button button--secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button--tertiary"
                      onClick={() => del(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No posts yet. Use &quot;New Post&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}