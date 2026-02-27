// app/news/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import { POST_TYPE_TEMPLATES } from '@/templates/postTypes';

import Banner from '@/components/Banner';
import Image from '@/helpers/Image';
import SidebarAccordion from '@/components/News/SidebarAccordion';
import NewsSidebar from '@/components/News/Sidebar';
import NewsBlocks from '@/components/News/NewsBlocks';

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

function normalizeSiteUrl(raw) {
  const site = String(raw || '').trim();
  if (!site) return 'https://brewood-news.vercel.app';
  return site.replace(/\/+$/, '');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getNewsPostBySlug(slug) {
  try {
    await dbConnect();
    return await Post.findOne({
      slug,
      postTypeKey: 'news',
      status: 'published',
    }).lean();
  } catch (error) {
    console.error('News post load failed:', error?.message || error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getNewsPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'News',
    };
  }

  const siteUrl = normalizeSiteUrl(
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  );
  const postUrl = `${siteUrl}/news/${post.slug}`;

  const intro = post?.templateData?.intro || {};
  const main = post?.templateData?.main || {};

  const image = String(intro?.introImage || main?.featuredImage || '').trim();
  const description =
    stripHtml(intro?.introText) ||
    stripHtml(main?.excerpt) ||
    stripHtml(main?.body).slice(0, 160) ||
    'Brewood Cricket Club news update.';

  return {
    title: post.title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      type: 'article',
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function NewsPostPage({ params }) {
  const { slug } = params;

  const post = await getNewsPostBySlug(slug);

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

  const activeCategories = Object.entries(taxonomy)
    .filter(([, val]) => val === true)
    .map(([key]) => key.replace(/^is/, '').replace(/([A-Z])/g, ' $1').trim());

  const allCategories = getAllNewsCategories();

  return (
    <>
      <Banner title="Brewood News" />

      <section className="py-12">
        <div className="container">
          <div className="gap-8 flex flex-col lg:flex-row">
            <div className="grow max-w-4xl space-y-8">
              <div className="space-y-2">
                <h1 className="h2">{title}</h1>
                {formattedDate && (
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                )}
              </div>

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

              {intro.introImage && (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
                  <Image
                    src={intro.introImage}
                    alt={title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 896px"
                    quality={58}
                    priority
                  />
                </div>
              )}

              {intro.introText && (
                <p className="h1">
                  {intro.introText}
                </p>
              )}

              {main.body && (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: main.body }}
                />
              )}

              {blocks.length > 0 && <NewsBlocks blocks={blocks} />}

              <div className="lg:hidden">
                <SidebarAccordion
                  categories={allCategories}
                  mode="navigate"
                  buttonClassName="w-full"
                />
              </div>
            </div>

            <div className="hidden lg:block lg:min-w-[400px]">
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
