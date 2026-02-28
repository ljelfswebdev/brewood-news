// components/forms/ContactForm.jsx
'use client';

import { useState } from 'react';
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
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function updateField(label, val) {
    setValues((prev) => ({ ...prev, [label]: val }));
  }

  function closeSuccessModal() {
    setShowSuccessModal(false);
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitError('');

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
      setSubmitError('Please fill in all required fields.');
      return;
    }
    // ---------------------------------------------------

    try {
      setIsSubmitting(true);
      const r = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          formKey: form.key,      // "contact"
          values,                 // { "Full Name": "...", "Email Address": "..." }
          honeypot,
          startedAt: formStartedAt,
        }),
      });

      if (!r.ok) {
        const payload = await r.json().catch(() => ({}));
        throw new Error(payload?.error || 'Form submit failed');
      }

      // Reset form if you want
      setValues((prev) => {
        const cleared = {};
        Object.keys(prev).forEach((k) => {
          cleared[k] = '';
        });
        return cleared;
      });
      setHoneypot('');
      setFormStartedAt(Date.now());
      setShowSuccessModal(true);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
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

        {/* Honeypot: hidden from users, catches simple bots */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website-url">Website</label>
          <input
            id="website-url"
            name="website-url"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {!!submitError && (
          <div className="rounded-primary border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeSuccessModal}
          role="presentation"
        >
          <div
            className="w-full max-w-xl rounded-primary bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Message sent"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="h4">Message Sent</h3>
                <p className="text-sm text-gray-600">Thank you, we&apos;ll get back to you shortly.</p>
              </div>
              <button
                type="button"
                className="h-10 w-10"
                onClick={closeSuccessModal}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#1F317C"/><path fill="#fff" d="M23.69 8.227a1.375 1.375 0 0 0-.17-1.912 1.32 1.32 0 0 0-1.879.173L16 13.38l-5.641-6.892a1.32 1.32 0 0 0-1.88-.173 1.375 1.375 0 0 0-.17 1.912l5.954 7.273-5.954 7.273a1.375 1.375 0 0 0 .17 1.912c.568.48 1.41.403 1.88-.173L16 17.62l5.641 6.892c.47.576 1.313.653 1.88.173.566-.479.64-1.335.17-1.912L17.737 15.5z"/></svg>
              </button>
            </div>
            <div className="flex justify-end">
              <button type="button" className="button button--primary" onClick={closeSuccessModal}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
