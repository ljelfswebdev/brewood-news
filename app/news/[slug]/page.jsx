// app/news/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';

import Banner from '@/components/Banner';
import Image from '@/helpers/Image';
import NewsSidebar from '@/components/News/Sidebar';
import NewsBlocks from '@/components/News/NewsBlocks';

/* ------------------------------------
   Helper: get ALL news categories
------------------------------------ */
function getAllNewsCategories() {
  const tpl = POST_TYPE_TEMPLATES?.news?.template || [];

  const taxonomySection =
    tpl.find((s) => s.key === 'taxonomy') ||
    tpl.find((s) => s.key === 'categories') ||
    null;

  if (!taxonomySection?.fields) return [];

  return taxonomySection.fields
    .filter(
      (f) =>
        f.type === 'checkbox' &&
        typeof f.name === 'string' &&
        f.name.startsWith('is')
    )
    .map((f) => f.label)
    .filter(Boolean);
}

export default async function NewsPostPage({ params }) {
  const { slug } = params;

  await dbConnect();

  const post = await Post.findOne({
    slug,
    postTypeKey: 'news',
    status: 'published',
  }).lean();

  if (!post) return notFound();

  const { title, publishDate, templateData = {} } = post;

  const taxonomy = templateData.taxonomy || {};
  const intro = templateData.intro || {};
  const main = templateData.main || {};
  const blocks = templateData.blocks?.blocks || [];

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  /* ------------------------------------
     Categories ON THIS POST (for pills)
  ------------------------------------ */
  const activeCategories = Object.entries(taxonomy)
    .filter(([, val]) => val === true)
    .map(([key]) =>
      key.replace(/^is/, '').replace(/([A-Z])/g, ' $1').trim()
    );

  /* ------------------------------------
     ALL categories (for sidebar)
  ------------------------------------ */
  const allCategories = getAllNewsCategories();

  return (
    <>
      <Banner title="Brewood News" />

      <section className="py-12">
        <div className="container">
          <div className="gap-8 flex flex-col-reverse lg:flex-row">
            {/* MAIN CONTENT */}
            <div className="grow max-w-4xl space-y-8">
              {/* TITLE */}
              <div className="space-y-2">
                <h1 className="h2">{title}</h1>
                {formattedDate && (
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                )}
              </div>

              {/* ACTIVE CATEGORIES */}
              {activeCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeCategories.map((cat) => (
                    <span
                      key={cat}
                      className="button button--secondary text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* INTRO IMAGE */}
              {intro.introImage && (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
                  <Image
                    src={intro.introImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* INTRO TEXT */}
              {intro.introText && (
                <p className="text-lg text-gray-700">
                  {intro.introText}
                </p>
              )}

              {/* MAIN BODY */}
              {main.body && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: main.body }}
                />
              )}

              {/* FLEXIBLE BLOCKS */}
              {blocks.length > 0 && <NewsBlocks blocks={blocks} />}
            </div>

            {/* SIDEBAR (ALL categories, navigate mode) */}
            <div className="lg:min-w-[400px]">
              <NewsSidebar
                categories={allCategories}
                mode="navigate"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}