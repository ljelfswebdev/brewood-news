// app/admin/posts/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';
import { mergeData, buildEmptyData } from '@helpers/templateHelpers';
import FieldBuilder from '@/components/admin/FieldBuilder';

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  // optional: ?type=news in URL for breadcrumb
  const qsType = searchParams.get('type') || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('published');
  const [publishedAt, setPublishedAt] = useState('');
  const [postTypeKey, setPostTypeKey] = useState('');
  const [templateKey, setTemplateKey] = useState('');

  const [templateData, setTemplateData] = useState({});
  const [activeSection, setActiveSection] = useState('');

  // Load the post
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/posts/${id}`, { cache: 'no-store' });
        if (!r.ok) throw new Error('Failed to load post');
        const p = await r.json();
        if (cancel) return;

        setTitle(p.title || '');
        setSlug(p.slug || '');
        setStatus(p.status || 'published');
        setPublishedAt(
          p.publishedAt ? String(p.publishedAt).slice(0, 10) : ''
        );
        setPostTypeKey(p.postTypeKey || '');
        setTemplateKey(p.templateKey || p.postTypeKey || '');

        const typeKey = p.templateKey || p.postTypeKey || '';
        const typeDef = POST_TYPE_TEMPLATES[typeKey];
        const tpl = typeDef?.template || [];

        if (tpl.length) {
          const merged = mergeData(tpl, p.templateData || {});
          setTemplateData(merged);
          setActiveSection(tpl[0]?.key || '');
        } else {
          setTemplateData({});
          setActiveSection('');
        }
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

  // Whenever templateKey changes (if you ever allow change), re-shape data
  useEffect(() => {
    if (!templateKey) return;
    const typeDef = POST_TYPE_TEMPLATES[templateKey];
    const tpl = typeDef?.template || [];
    if (!tpl.length) return;
    setTemplateData((prev) => mergeData(tpl, prev));
    setActiveSection((old) => old || tpl[0]?.key || '');
  }, [templateKey]);

  function getShareHref() {
    const cleanSlug =
      String(slug || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || '';

    if (!cleanSlug || !String(title || '').trim()) return '';

    const envSite = String(process.env.NEXT_PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '');
    const origin =
      envSite || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!origin) return '';

    const postUrl = `${origin}/news/${cleanSlug}`;
    return `https://wa.me/?text=${encodeURIComponent(`${title}\n${postUrl}`)}`;
  }

  async function save() {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!postTypeKey) {
      toast.error('postTypeKey missing on this post');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        status,
        publishedAt,
        postTypeKey,
        templateKey: templateKey || postTypeKey,
        templateData,
      };

      const r = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());
      toast.success('Post saved');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this post?')) return;
    const r = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Deleted');
    const backType = qsType || postTypeKey || 'news';
    router.push(`/admin/posts?type=${backType}`);
  }

  if (loading) return <div className="card">Loading…</div>;

  const typeDef = POST_TYPE_TEMPLATES[templateKey || postTypeKey];
  const template = typeDef?.template || [];
  const whatsappHref =
    postTypeKey === 'news' && status === 'published' ? getShareHref() : '';

  return (
    <div className="space-y-4">
      <a
        href={`/admin/posts?type=${postTypeKey || qsType || 'news'}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to {typeDef?.label || postTypeKey || qsType || 'posts'}
      </a>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            Edit {typeDef?.label || postTypeKey || 'Post'}
          </h1>
          <div className="flex items-center gap-2">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--secondary"
              >
                Share On WhatsApp
              </a>
            )}
            <button
              className="button button--tertiary text-xs"
              onClick={del}
            >
              Delete
            </button>
          </div>
        </div>

        {/* META */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="input w-full"
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                )
              }
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="label">Status</label>
            <select
              className="input w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="label">Published date</label>
            <input
              type="date"
              className="input w-full"
              value={publishedAt || ''}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
          <div className="flex items-end text-xs text-gray-500">
            <div>
              Type: <strong>{postTypeKey}</strong>
            </div>
          </div>
        </div>

        {/* TEMPLATE FIELDS */}
        {template.length > 0 && (
          <div className="mt-4">
            <h4 className=" mb-2">
              Template Fields ({templateKey || postTypeKey})
            </h4>
            <FieldBuilder
              template={template}
              data={templateData}
              onChange={setTemplateData}
              activeSection={activeSection || template[0]?.key}
              setActiveSection={setActiveSection}
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
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
