// app/admin/posts/new/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';
import { mergeData, buildEmptyData } from '@helpers/templateHelpers';
import FieldBuilder from '@/components/admin/FieldBuilder';

export default function NewPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postTypeKey = searchParams.get('type') || '';

  const typeDef = postTypeKey ? POST_TYPE_TEMPLATES[postTypeKey] : null;
  const template = typeDef?.template || [];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // meta
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('published');
  const [publishedAt, setPublishedAt] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  // template data
  const [templateData, setTemplateData] = useState(
    () => buildEmptyData(template)
  );
  const [activeSection, setActiveSection] = useState(
    template[0]?.key || ''
  );

  // re-shape data when type/template changes
  useEffect(() => {
    if (!template.length) return;
    setTemplateData((prev) => mergeData(template, prev));
    setActiveSection((old) => old || template[0]?.key || '');
  }, [postTypeKey]);

  if (!postTypeKey || !typeDef) {
    return (
      <div className="card">
        <h1 className="text-lg font-semibold mb-2">New Post</h1>
        <p className="text-sm mb-2">
          Pick a post type first – e.g. go to{' '}
          <code>/admin/posts?type=news</code> and click &ldquo;New Post&rdquo;.
        </p>
      </div>
    );
  }

  function slugify(val) {
    return String(val || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function maybeAutoSlugFromTitle() {
    if (String(slug || '').trim()) return;
    setSlug(slugify(title));
  }

  function getShareHref() {
    const cleanSlug =
      (slug || title)
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
    const introText = String(
      templateData?.intro?.introText || templateData?.main?.excerpt || ''
    ).trim();
    const introIsDuplicateTitle =
      introText.toLowerCase() === String(title || '').trim().toLowerCase();
    const message = introText && !introIsDuplicateTitle
      ? `${title}\n${introText}\n\nRead more at: ${postUrl}`
      : `${title}\n\nRead more at: ${postUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  async function save() {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        postTypeKey,
        templateKey: postTypeKey,
        title,
        slug,
        status,
        publishedAt,
        templateData,
      };

      const r = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(await r.text());

      toast.success('Post created');
      router.push(`/admin/posts?type=${postTypeKey}`);
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const whatsappHref =
    postTypeKey === 'news' && status === 'published' ? getShareHref() : '';

  return (
    <div className="space-y-4">
      <a
        href={`/admin/posts?type=${postTypeKey}`}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to {typeDef.label || postTypeKey} posts
      </a>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            New {typeDef.label || postTypeKey} Post
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
              className="button button--primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save post'}
            </button>
          </div>
        </div>

        {/* META FIELDS */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input
              className="input w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={maybeAutoSlugFromTitle}
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="input w-full"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.replace(/^\/+/, ''))
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
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
          <div className="flex items-end text-xs text-gray-500">
            <div>Post type: <strong>{postTypeKey}</strong></div>
          </div>
        </div>

        {/* TEMPLATE FIELDS */}
        {template.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2">
              Template Fields ({postTypeKey})
            </h4>
            <FieldBuilder
              template={template}
              data={templateData}
              onChange={setTemplateData}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
        )}
      </div>
    </div>
  );
}
