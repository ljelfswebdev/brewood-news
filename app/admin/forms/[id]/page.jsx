// app/admin/forms/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Select from 'react-select';

function OptionItem({ value, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <input
        className="input w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Option value"
      />
      <button
        type="button"
        className="button button--tertiary"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  );
}

function SelectOptions({ value = [], onChange }) {
  function add() {
    onChange([...(value || []), '']);
  }
  function updateAt(i, v) {
    const next = [...(value || [])];
    next[i] = v;
    onChange(next);
  }
  function removeAt(i) {
    const next = [...(value || [])];
    next.splice(i, 1);
    onChange(next);
  }
  return (
    <div className="mt-2 space-y-2">
      <div className="flex justify-between items-center">
        <label className="label m-0">Options</label>
        <button
          type="button"
          className="button button--secondary"
          onClick={add}
        >
          Add option
        </button>
      </div>
      {(value || []).map((opt, i) => (
        <OptionItem
          key={i}
          value={opt}
          onChange={(v) => updateAt(i, v)}
          onRemove={() => removeAt(i)}
        />
      ))}
      {!value?.length && (
        <p className="text-sm text-gray-500">No options yet.</p>
      )}
    </div>
  );
}

const typeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
];

function FieldEditor({ field, onChange }) {
  const type = field.type || 'text';
  const required = !!field.required;

  const currentTypeOption =
    typeOptions.find((opt) => opt.value === type) || typeOptions[0];

  return (
    <div className="border rounded-xl p-3 bg-white space-y-2">
      <div>
        <label className="label">Label</label>
        <input
          className="input w-full"
          value={field.label || ''}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
        />
      </div>

      <div>
        <label className="label mt-2">Placeholder</label>
        <input
          className="input w-full"
          value={field.placeholder || ''}
          onChange={(e) =>
            onChange({ ...field, placeholder: e.target.value })
          }
          placeholder="Optional placeholder text"
        />
      </div>

      <div>
        <label className="label mt-2">Type</label>
        <Select
          className="form-select mt-1"
          value={currentTypeOption}
          onChange={(opt) =>
            onChange({
              ...field,
              type: opt.value,
              options: opt.value === 'select' ? field.options || [] : undefined,
            })
          }
          options={typeOptions}
        />
      </div>

      {type === 'select' && (
        <SelectOptions
          value={field.options || []}
          onChange={(opts) => onChange({ ...field, options: opts })}
        />
      )}

      {/* Required toggle */}
      <div className="mt-3 flex items-center gap-2">
        <input
          id={`required-${field.label || ''}-${type}`}
          type="checkbox"
          checked={required}
          onChange={(e) =>
            onChange({ ...field, required: e.target.checked })
          }
        />
        <label
          htmlFor={`required-${field.label || ''}-${type}`}
          className="text-xs"
        >
          Required
        </label>
      </div>
    </div>
  );
}

const columnOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
];

function RowEditor({ row, onChange, onRemove }) {
  function setColumns(option) {
    const columns = Number(option?.value) === 2 ? 2 : 1;
    let fields = row.fields || [];
    if (columns === 1) {
      fields = fields.slice(0, 1).length
        ? fields.slice(0, 1)
        : [{ label: '', type: 'text', required: false }];
    }
    if (columns === 2) {
      fields = (fields.concat([{}, {}]))
        .slice(0, 2)
        .map((f) => ({ label: '', type: 'text', required: false, ...f }));
    }
    onChange({ ...row, columns, fields });
  }

  function updateField(i, patch) {
    const fields = [...(row.fields || [])];
    fields[i] = patch;
    onChange({ ...row, fields });
  }

  const columns = row.columns === 2 ? 2 : 1;
  const currentColumnsOption =
    columnOptions.find((opt) => opt.value === columns) || columnOptions[0];

  const fields =
    columns === 1
      ? (row.fields || []).slice(0, 1).length
        ? (row.fields || []).slice(0, 1)
        : [{ label: '', type: 'text', required: false }]
      : (row.fields || [])
          .concat([{}, {}])
          .slice(0, 2)
          .map((f) => ({ label: '', type: 'text', required: false, ...f }));

  return (
    <div className="border rounded-xl p-3 mb-3 bg-white">
      <div className="flex items-center gap-3">
        <label className="label m-0">Columns</label>
        <div className="w-24">
          <Select
            className="form-select"
            value={currentColumnsOption}
            onChange={setColumns}
            options={columnOptions}
          />
        </div>
        <button
          type="button"
          className="button button--tertiary ml-auto"
          onClick={onRemove}
        >
          Remove Row
        </button>
      </div>
      <div className={`grid gap-3 mt-3 ${columns === 2 ? 'grid-cols-2' : ''}`}>
        {fields.map((f, i) => (
          <FieldEditor
            key={i}
            field={f}
            onChange={(patch) => updateField(i, patch)}
          />
        ))}
      </div>
    </div>
  );
}

export default function EditForm() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [key, setKey] = useState('contact');
  const [rows, setRows] = useState([]);
  const [autoReply, setAutoReply] = useState({
    enabled: false,
    subject: '',
    message: '',
    fromName: '',
    fromEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/admin/forms/${id}`, { cache: 'no-store' });
        if (!r.ok) throw new Error('Failed to load form');
        const d = await r.json();
        if (cancelled) return;

        setName(d.name || '');
        setKey(d.key || 'contact');

        const normalized = (d.rows || []).map((row) => {
          const columns = row.columns === 2 ? 2 : 1;
          let fields = Array.isArray(row.fields) ? row.fields : [];
          if (columns === 1) {
            fields = fields.slice(0, 1).length
              ? fields.slice(0, 1)
              : [{ label: '', type: 'text', required: false }];
          }
          if (columns === 2) {
            fields = (fields.concat([{}, {}]))
              .slice(0, 2)
              .map((f) => ({
                label: '',
                type: 'text',
                required: false,
                ...f,
              }));
          }
          return { columns, fields };
        });

        setRows(
          normalized.length
            ? normalized
            : [
                {
                  columns: 2,
                  fields: [
                    {
                      label: 'Full Name',
                      type: 'text',
                      placeholder: 'Your name',
                      required: true,
                    },
                    {
                      label: 'Email Address',
                      type: 'text',
                      placeholder: 'you@example.com',
                      required: true,
                    },
                  ],
                },
              ]
        );

        setAutoReply(
          d?.autoReply || {
            enabled: false,
            subject: '',
            message: '',
            fromName: '',
            fromEmail: '',
          }
        );
      } catch (e) {
        toast.error(e.message || 'Error loading form');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { columns: 1, fields: [{ label: '', type: 'text', required: false }] },
    ]);
  }
  function updateRow(i, patch) {
    const next = [...rows];
    next[i] = patch;
    setRows(next);
  }
  function removeRow(i) {
    const next = [...rows];
    next.splice(i, 1);
    setRows(next);
  }

  async function save() {
    if (!name.trim() || !key.trim()) {
      toast.error('Name and key are required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`/api/admin/forms/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, key, rows, autoReply }),
      });
      if (!r.ok) {
        let msg = await r.text();
        try {
          const j = JSON.parse(msg);
          msg = j.error || msg;
        } catch {}
        if (r.status === 409) {
          toast.error('Key already in use – pick another.');
        } else {
          toast.error(msg || 'Save failed');
        }
        setSaving(false);
        return;
      }
      toast.success('Form updated');
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this form?')) return;
    const r = await fetch(`/api/admin/forms/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Deleted');
    router.push('/admin/forms');
  }

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="space-y-6">
      <a
        href="/admin/forms"
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        ← Back to Forms
      </a>

      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Form</h3>
          <div className="flex gap-2">
            <button className="button button--tertiary" onClick={remove}>
              Delete
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 my-3">
          <div>
            <span className="label m-0">Name</span>
            <input
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <span className="label m-0">Key</span>
            <input
              className="input w-full"
              value={key}
              onChange={(e) =>
                setKey(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]+/g, '-')
                    .replace(/^-+|-+$/g, '') || 'contact'
                )
              }
            />
          </div>
        </div>

        {/* Auto-reply (same as create) */}
        <div className="border rounded-2xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <input
              id="ar"
              type="checkbox"
              checked={!!autoReply.enabled}
              onChange={(e) =>
                setAutoReply((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }))
              }
            />
            <label htmlFor="ar" className="label m-0">
              Enable Auto-reply
            </label>
          </div>
          {autoReply.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="md:col-span-2">
                <label className="label">Subject</label>
                <input
                  className="input w-full"
                  value={autoReply.subject}
                  onChange={(e) =>
                    setAutoReply((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Message</label>
                <textarea
                  className="input w-full"
                  rows={5}
                  value={autoReply.message}
                  onChange={(e) =>
                    setAutoReply((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="label">From Name (optional)</label>
                <input
                  className="input w-full"
                  value={autoReply.fromName}
                  onChange={(e) =>
                    setAutoReply((prev) => ({
                      ...prev,
                      fromName: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="label">From Email (optional)</label>
                <input
                  className="input w-full"
                  value={autoReply.fromEmail}
                  onChange={(e) =>
                    setAutoReply((prev) => ({
                      ...prev,
                      fromEmail: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {rows.map((row, i) => (
          <RowEditor
            key={i}
            row={row}
            onChange={(patch) => updateRow(i, patch)}
            onRemove={() => removeRow(i)}
          />
        ))}

        <div className="flex gap-2">
          <button
            type="button"
            className="button button--secondary"
            onClick={addRow}
          >
            Add Row
          </button>
          <button
            type="button"
            className="button button--primary ml-auto"
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
