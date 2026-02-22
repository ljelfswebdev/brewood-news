import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { requireAdmin } from '@helpers/auth';

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();

  const postTypeKey = String(body?.postTypeKey || '').trim();
  const ids = Array.isArray(body?.ids)
    ? body.ids
        .map((v) => {
          if (typeof v === 'string') return v;
          if (v && typeof v === 'object' && typeof v.$oid === 'string') return v.$oid;
          if (v == null) return '';
          return String(v);
        })
        .filter(Boolean)
    : [];

  if (!postTypeKey || !ids.length) {
    return NextResponse.json(
      { error: 'postTypeKey and ids are required' },
      { status: 400 }
    );
  }

  const docs = await Post.find({ _id: { $in: ids }, postTypeKey }).select('_id').lean();
  if (docs.length !== ids.length) {
    return NextResponse.json(
      { error: 'One or more posts were not found for this post type' },
      { status: 400 }
    );
  }

  await Post.bulkWrite(
    ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id, postTypeKey },
        update: { $set: { sortOrder: index } },
      },
    }))
  );

  return NextResponse.json({ ok: true });
}
