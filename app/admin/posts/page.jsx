// app/admin/posts/page.jsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AdminPostsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postTypeKey = searchParams.get('type') || '';
  const isCommitteeType = postTypeKey === 'committee';
  const [query, setQuery] = useState('');
  const [committeeRows, setCommitteeRows] = useState([]);
  const [isSavingCommitteeOrder, setIsSavingCommitteeOrder] = useState(false);

  const { data, isLoading, mutate } = useSWR(
    `/api/admin/posts${postTypeKey ? `?type=${postTypeKey}` : ''}`,
    fetcher
  );

  function postId(post) {
    const raw = post?._id;
    if (typeof raw === 'string') return raw;
    if (raw && typeof raw === 'object' && typeof raw.$oid === 'string') return raw.$oid;
    if (raw != null) return String(raw);
    return '';
  }

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

  const rows = data?.items || [];
  useEffect(() => {
    if (isCommitteeType && !isSavingCommitteeOrder) setCommitteeRows(rows);
  }, [isCommitteeType, rows, isSavingCommitteeOrder]);

  const dataRows = isCommitteeType ? committeeRows : rows;
  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return dataRows;
    return dataRows.filter((p) =>
      [p.title, p.path, p.postTypeKey].some((v) =>
        String(v || '')
          .toLowerCase()
          .includes(search)
      )
    );
  }, [dataRows, query]);
  const typeLabel = data?.postType?.label || postTypeKey || 'All';
  const queryTrimmed = query.trim();

  async function saveCommitteeOrder(nextRows) {
    const updates = nextRows.map(async (p, index) => {
      const id = postId(p);
      if (!id) throw new Error('Invalid post id');
      const r = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sortOrder: index }),
      });
      if (!r.ok) throw new Error('Failed to save committee order');
    });
    await Promise.all(updates);
  }

  async function onCommitteeDragEnd(result) {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;
    if (queryTrimmed) return;

    const previous = [...committeeRows];
    const next = [...committeeRows];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);

    setIsSavingCommitteeOrder(true);
    setCommitteeRows(next);
    try {
      if (data) {
        mutate({ ...data, items: next }, false);
      }
      await saveCommitteeOrder(next);
      toast.success('Committee order updated');
      await mutate();
    } catch (e) {
      setCommitteeRows(previous);
      if (data) {
        mutate({ ...data, items: previous }, false);
      }
      toast.error(e.message || 'Failed to update order');
    } finally {
      setIsSavingCommitteeOrder(false);
    }
  }

  if (isLoading) return <div className="card">Loading…</div>;

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
        <div className="mb-4 flex items-center justify-between gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title, URL, or type"
            className="w-full max-w-md rounded-primary border border-gray-300 px-3 py-2 text-sm"
          />
          <div className="shrink-0 text-xs text-gray-500">
            Showing {filteredRows.length} of {dataRows.length}
          </div>
        </div>

        {isCommitteeType && (
          <div className="mb-4">
            {queryTrimmed ? (
              <p className="text-xs text-gray-500">
                Clear search to drag and reorder committee members.
              </p>
            ) : (
              <div>
                <p className="mb-2 text-xs text-gray-500">
                  Drag committee members to set display order.
                </p>
                <DragDropContext onDragEnd={onCommitteeDragEnd}>
                  <Droppable droppableId="committee-posts-order">
                    {(provided) => (
                      <ul
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-2"
                      >
                        {committeeRows.map((p, index) => (
                          <Draggable
                            key={postId(p)}
                            draggableId={postId(p)}
                            index={index}
                          >
                            {(prov) => (
                              <li
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                className="flex items-center justify-between rounded-primary border border-gray-200 bg-white px-3 py-2"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span
                                    {...prov.dragHandleProps}
                                    className="cursor-grab rounded border px-2 py-1 text-xs"
                                    title="Drag to reorder"
                                  >
                                    ⇅
                                  </span>
                                  <span className="truncate text-sm font-medium">
                                    {p.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  #{index + 1}
                                </span>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        )}

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
            {filteredRows.map((p) => (
              <tr key={postId(p)} className="border-t">
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
                      href={`/admin/posts/${postId(p)}`}
                      className="button button--secondary"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button--tertiary"
                      onClick={() => del(postId(p))}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!dataRows.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No posts yet. Use &quot;New Post&quot; to create one.
                </td>
              </tr>
            )}
            {!!dataRows.length && !filteredRows.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No posts match &quot;{query.trim()}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
