// app/api/admin/posts/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { requireAdmin } from '@helpers/auth';

export async function GET(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();

  // read ?type=news etc from the query string
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || '';

  // if type is supplied, filter by postTypeKey
  const filter = type ? { postTypeKey: type } : {};
  const sort =
    type === 'committee'
      ? { sortOrder: 1, createdAt: 1 }
      : { createdAt: -1 };

  const items = await Post.find(filter).sort(sort).lean();

  return NextResponse.json({ items });
}

export async function POST(req) {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  await dbConnect();
  const body = await req.json();

  const {
    postTypeKey,
    templateKey,
    title,
    slug,
    status = 'published',
    publishedAt,
    sortOrder,
    templateData,
  } = body;

  if (!title || !postTypeKey) {
    return NextResponse.json(
      { error: 'title and postTypeKey are required' },
      { status: 400 }
    );
  }

  const cleanSlug =
    (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post';

  let resolvedSortOrder = Number(sortOrder);
  if (!Number.isFinite(resolvedSortOrder)) {
    if (postTypeKey === 'committee') {
      const last = await Post.findOne({ postTypeKey }).sort({ sortOrder: -1 }).lean();
      resolvedSortOrder = Number.isFinite(last?.sortOrder) ? Number(last.sortOrder) + 1 : 0;
    } else {
      resolvedSortOrder = 0;
    }
  }

  const doc = await Post.create({
    title,
    slug: cleanSlug,
    postTypeKey,
    templateKey: templateKey || postTypeKey,
    status,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    sortOrder: resolvedSortOrder,
    templateData: templateData || {},
  });

  return NextResponse.json(doc);
}
