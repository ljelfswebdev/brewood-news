// app/admin/post-types/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';

export default function EditPostType() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [templateKey, setTemplateKey] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/post-types/${id}`, {
          cache: 'no-store',
        });
        if (!r.ok) throw new Error('Failed to load');
        const d = await r.json();
        if (cancel) return;
        setLabel(d.label || '');
        setKey(d.key || '');
        setTemplateKey(d.templateKey || '');
      } catch (e) {
        toast.error(e.message || 'Load failed');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  async function save() {
    setSaving(true);
    try {
      const payload = { label, key, templateKey };
      const r = await fetch(`/api/admin/post-types/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      toast.success('Saved');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this post type?')) return;
    const r = await fetch(`/api/admin/post-types/${id}`, {
      method: 'DELETE',
    });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Deleted');
    router.push('/admin/post-types');
  }

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="space-y-4">
      <a
        href="/admin/post-types"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to post types
      </a>
      <div className="card space-y-3 max-w-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Edit Post Type</h1>
          <button className="button button--tertiary text-xs" onClick={del}>
            Delete
          </button>
        </div>

        <label className="label">Label</label>
        <input
          className="input w-full"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <label className="label">Key (used in URL e.g. /news)</label>
        <input
          className="input w-full"
          value={key}
          onChange={(e) =>
            setKey(e.target.value.toLowerCase().replace(/\s+/g, '-'))
          }
        />

        <label className="label">Template</label>
        <select
          className="input w-full"
          value={templateKey}
          onChange={(e) => setTemplateKey(e.target.value)}
        >
          <option value="">— Select template —</option>
          {Object.values(POST_TYPE_TEMPLATES).map((t) => (
            <option key={t.key} value={t.key}>
              {t.label} ({t.key})
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button
            className="button button--primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}