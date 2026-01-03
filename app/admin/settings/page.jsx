// app/admin/settings/page.jsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { GLOBAL_SETTINGS_TEMPLATE } from '@/templates/settings/global';
import { mergeData } from '@helpers/templateHelpers';
import FieldBuilder from '@/components/admin/FieldBuilder';

const TEMPLATE = GLOBAL_SETTINGS_TEMPLATE;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [templateData, setTemplateData] = useState({});
  const [activeSection, setActiveSection] = useState(
    TEMPLATE[0]?.key || ''
  );

  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        const r = await fetch('/api/admin/settings/global', {
          cache: 'no-store',
        });
        if (!r.ok) throw new Error('Failed to load settings');
        const d = await r.json();
        if (cancel) return;

        const merged = mergeData(TEMPLATE, d.templateData || {});
        setTemplateData(merged);
        setActiveSection((prev) => prev || TEMPLATE[0]?.key || '');
      } catch (e) {
        toast.error(e.message || 'Error loading settings');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, []);

  async function save() {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/settings/global', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ templateData }),
      });
      if (!r.ok) throw new Error(await r.text());
      toast.success('Settings saved');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="space-y-4">
      <a
        href="/admin"
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </a>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Global Settings</h1>
          <button
            className="button button--primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>

        <FieldBuilder
          template={TEMPLATE}
          data={templateData}
          onChange={setTemplateData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="flex justify-end pt-2">
          <button
            className="button button--primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}