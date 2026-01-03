// components/forms/ContactForm.jsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';

export default function ContactForm({ form }) {
  // Build initial state based on the form rows/fields
  const [values, setValues] = useState(() => {
    const v = {};
    (form.rows || []).forEach((row) => {
      (row.fields || []).forEach((field) => {
        // Use label as the key
        v[field.label] = '';
      });
    });
    return v;
  });

  function updateField(label, val) {
    setValues((prev) => ({ ...prev, [label]: val }));
  }

  async function submit(e) {
    e.preventDefault();

    // ---- client-side validation for required fields ----
    const missing = [];

    (form.rows || []).forEach((row) => {
      (row.fields || []).forEach((field) => {
        if (!field) return;
        const label = field.label;
        const isRequired = !!field.required;
        if (!label || !isRequired) return;

        const val = values[label];
        const str = typeof val === 'string' ? val.trim() : val;
        if (!str) {
          missing.push(label);
        }
      });
    });

    if (missing.length) {
      toast.error('Please fill in all required fields.');
      return;
    }
    // ---------------------------------------------------

    try {
      const r = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          formKey: form.key,      // "contact"
          values,                 // { "Full Name": "...", "Email Address": "..." }
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || 'Form submit failed');
      }

      toast.success('Thanks, your message has been sent');

      // Reset form if you want
      setValues((prev) => {
        const cleared = {};
        Object.keys(prev).forEach((k) => {
          cleared[k] = '';
        });
        return cleared;
      });
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {(form.rows || []).map((row, i) => (
        <div
          key={i}
          className={`grid gap-3 ${row.columns === 2 ? 'md:grid-cols-2' : ''}`}
        >
          {(row.fields || []).map((field, j) => {
            if (!field) return null;

            const label = field.label;
            const type = field.type || 'text';
            const required = !!field.required;
            const val = values[label] || '';

            // Textarea
            if (type === 'textarea') {
              return (
                <div key={j}>
                  <label className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    className="input w-full"
                    placeholder={field.placeholder || ''}
                    value={val}
                    onChange={(e) => updateField(label, e.target.value)}
                    required={required}
                  />
                </div>
              );
            }

            // Select (react-select)
            if (type === 'select') {
              const options = (field.options || []).map((opt) => ({
                value: opt,
                label: opt,
              }));
              const selectedOption =
                options.find((o) => o.value === val) || null;

              return (
                <div key={j}>
                  <label className="label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Select
                    options={options}
                    value={selectedOption}
                    onChange={(option) =>
                      updateField(label, option ? option.value : '')
                    }
                    placeholder={field.placeholder || ''}
                    // react-select doesn't support native `required`, we validate manually above
                    classNamePrefix="react-select"
                  />
                </div>
              );
            }

            // Default: text input
            return (
              <div key={j}>
                <label className="label">
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  className="input w-full"
                  type="text"
                  placeholder={field.placeholder || ''}
                  value={val}
                  onChange={(e) => updateField(label, e.target.value)}
                  required={required}
                />
              </div>
            );
          })}
        </div>
      ))}

      <button type="submit" className="button button--primary">
        Send Message
      </button>
    </form>
  );
}