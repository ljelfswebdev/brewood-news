// app/admin/pages/[id]/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { PAGE_TEMPLATES } from '@/templates/pages';
import { mergeData, buildEmptyData } from '@helpers/templateHelpers';
import FieldBuilder from '@/components/admin/FieldBuilder';

export default function EditPageAdmin() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [templateKey, setTemplateKey] = useState('default');
  const [body, setBody] = useState('');

  const [templateData, setTemplateData] = useState({});
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/pages/${id}`, { cache: 'no-store' });
        if (!r.ok) throw new Error('Failed to load');
        const p = await r.json();
        if (cancel) return;

        setTitle(p.title || '');
        setSlug(p.slug || '');
        setTemplateKey(p.templateKey || 'default');
        setBody(p.body || '');

        const tplMeta = PAGE_TEMPLATES[p.templateKey];
        const tplSections = tplMeta?.sections;

        if (tplSections) {
          const merged = mergeData(tplSections, p.templateData || {});
          setTemplateData(merged);
          setActiveSection(tplSections[0]?.key || '');
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

  // When templateKey changes, re-shape templateData
  useEffect(() => {
    const tplMeta = PAGE_TEMPLATES[templateKey];
    const tplSections = tplMeta?.sections;
    if (!tplSections) return;

    setTemplateData((prev) => mergeData(tplSections, prev));
    setActiveSection((old) => old || tplSections[0]?.key || '');
  }, [templateKey]);

  async function save() {
    setSaving(true);
    try {
      const payload = {
        title,
        slug,
        templateKey,
        body,
        templateData,
      };
      const r = await fetch(`/api/admin/pages/${id}`, {
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
    if (!confirm('Delete this page?')) return;
    const r = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    if (!r.ok) return toast.error('Delete failed');
    toast.success('Deleted');
    router.push('/admin/pages');
  }

  if (loading) return <div className="card">Loading…</div>;

  const templateKeys = Object.keys(PAGE_TEMPLATES);
  const currentTemplateMeta = PAGE_TEMPLATES[templateKey];
  const currentSections = currentTemplateMeta?.sections;

  return (
    <div className="space-y-4">
      <a
        href="/admin/pages"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to pages
      </a>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Edit Page</h1>
          <button
            className="button button--tertiary text-xs"
            onClick={del}
          >
            Delete
          </button>
        </div>

        {/* BASIC META */}
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
              setSlug(e.target.value.replace(/^\/+/, ''))
            }
          />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Template</label>
            <select
              className="input w-full"
              value={templateKey}
              onChange={(e) => setTemplateKey(e.target.value)}
            >
              <option value="default">Default (body only)</option>
              {templateKeys.map((key) => (
                <option key={key} value={key}>
                  {PAGE_TEMPLATES[key].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Body (used if template = default)</label>
            <textarea
              className="input w-full"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>

        {/* TEMPLATE FIELDS */}
        {currentSections && (
          <div className="mt-4">
            <h4 className="mb-2">
              Template Fields ({templateKey})
            </h4>
            <FieldBuilder
              template={currentSections}
              data={templateData}
              onChange={setTemplateData}
              activeSection={
                activeSection || currentSections[0]?.key
              }
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