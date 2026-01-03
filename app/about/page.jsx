// app/about/page.jsx
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AboutIndexPage() {
  await dbConnect();

  // all pages that use the "about" template
  const pages = await Page.find({ templateKey: 'about' })
    .sort({ createdAt: 1 })
    .lean();

  if (!pages.length) {
    return (
      <section className="container py-10 space-y-4">
        <h1 className="text-2xl font-semibold">About pages</h1>
        <p className="text-sm text-gray-600">
          No pages currently use the <code>about</code> template.
          Go to <code>/admin/pages</code>, create a page and set its template to
          <strong> “about”</strong>.
        </p>
      </section>
    );
  }

  return (
    <section className="container py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="text-sm text-gray-600">
          The following pages are using the <code>about</code> template.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <article
            key={page._id.toString()}
            className="card flex flex-col gap-2"
          >
            <h2 className="text-lg font-semibold">{page.title}</h2>
            <p className="text-xs text-gray-500 break-all">
              slug: <code>/{page.slug}</code>
            </p>

            {/* If you still have a public route for each slug, link to it.
                If you truly removed [slug], comment this Link out. */}
            <div className="mt-2">
              <Link
                href={`/${page.slug}`}
                className="button button--secondary text-xs"
              >
                View page
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}