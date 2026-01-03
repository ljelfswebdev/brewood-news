// components/admin/CloudinaryUpload.jsx
'use client';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars not set');
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const r = await fetch(url, { method: 'POST', body: fd });
  if (!r.ok) throw new Error('Upload failed');
  return r.json();
}

export default function CloudinaryUpload({ value, onChange }) {
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadToCloudinary(file);
      onChange?.(res.secure_url);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-full max-w-xs rounded-md border" />
      )}
      <input type="file" accept="image/*" onChange={onFile} />
      <input
        className="input w-full"
        placeholder="Or paste image URL"
        value={value || ''}
        onChange={(e)=>onChange?.(e.target.value)}
      />
    </div>
  );
}