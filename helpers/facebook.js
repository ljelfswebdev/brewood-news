const GRAPH_API_VERSION = 'v22.0';

function normalizeSiteUrl(raw) {
  const site = String(raw || '').trim();
  if (!site) return '';
  return site.replace(/\/+$/, '');
}

function resolveNewsImage(templateData = {}) {
  const intro = templateData?.intro || {};
  const main = templateData?.main || {};
  return String(intro.introImage || main.featuredImage || '').trim();
}

export async function publishNewsToFacebook({ title, slug, templateData }) {
  const pageId = String(process.env.FACEBOOK_PAGE_ID || '').trim();
  const accessToken = String(process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '').trim();
  const siteUrl = normalizeSiteUrl(
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  );

  if (!pageId || !accessToken || !siteUrl) return { skipped: true };

  const safeSlug = String(slug || '')
    .trim()
    .replace(/^\/+/, '');
  if (!safeSlug) return { skipped: true };

  const link = `${siteUrl}/news/${safeSlug}`;
  const imageUrl = resolveNewsImage(templateData);
  const caption = `${String(title || '').trim()}\n\n${link}`.trim();

  if (imageUrl) {
    const photoEndpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/photos`;
    const photoBody = new URLSearchParams({
      url: imageUrl,
      caption,
      access_token: accessToken,
    });
    const photoRes = await fetch(photoEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: photoBody.toString(),
    });
    const photoJson = await photoRes.json().catch(() => ({}));
    if (!photoRes.ok) {
      throw new Error(photoJson?.error?.message || 'Facebook photo post failed');
    }
    return { ok: true, id: photoJson?.id || null, mode: 'photo' };
  }

  const feedEndpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/feed`;
  const feedBody = new URLSearchParams({
    message: String(title || '').trim(),
    link,
    access_token: accessToken,
  });
  const feedRes = await fetch(feedEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: feedBody.toString(),
  });
  const feedJson = await feedRes.json().catch(() => ({}));
  if (!feedRes.ok) {
    throw new Error(feedJson?.error?.message || 'Facebook feed post failed');
  }
  return { ok: true, id: feedJson?.id || null, mode: 'link' };
}
