import Link from 'next/link';
import Banner from '@/components/Banner';
import Reveal from '@/components/animations/Reveal';
import Image from '@/helpers/Image';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

function SponsorCard({ sponsor }) {
  const main = sponsor?.templateData?.main || {};
  const title = String(sponsor?.title || 'Sponsor').trim();
  const image = String(main?.image || '').trim();
  const link = String(main?.link || '').trim();
  const content = String(main?.content || '').trim();

  return (
    <article className="card flex h-full flex-col gap-4 border-2 border-primary">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-primary bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={58}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <h2 className="h4 break-words">{title}</h2>

        {content ? (
          <Reveal delay={100}>
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Reveal>
        ) : null}

        {link ? (
          <Reveal className="mt-auto pt-2" delay={160}>
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--secondary w-full"
            >
              Visit Site
            </Link>
          </Reveal>
        ) : null}
      </div>
    </article>
  );
}

export default async function OurSupportersPage() {
  await dbConnect();

  const [page, sponsors] = await Promise.all([
    Page.findOne({ slug: 'our-supporters' }).lean(),
    Post.find({ postTypeKey: 'sponsors', status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean(),
  ]);

  const pageTitle = String(page?.title || '').trim() || 'Our Supporters';
  const templateData = page?.templateData || {};
  const topContent = String(templateData?.top?.content || '').trim();
  const bottomContent = String(templateData?.bottom?.content || '').trim();
  const safeSponsors = JSON.parse(JSON.stringify(sponsors || [])).sort((a, b) => {
    const aPrimary = a?.templateData?.main?.isPrimarySponsor ? 1 : 0;
    const bPrimary = b?.templateData?.main?.isPrimarySponsor ? 1 : 0;
    return bPrimary - aPrimary;
  });

  return (
    <>
      <Banner title={pageTitle} />

      <section className="py-12">
        <div className="container space-y-8">
          {topContent ? (
            <Reveal>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: topContent }}
              />
            </Reveal>
          ) : null}

          {safeSponsors.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {safeSponsors.map((sponsor, index) => (
                <Reveal key={String(sponsor?._id)} delay={index * 90}>
                  <SponsorCard sponsor={sponsor} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="card text-sm text-gray-600">
              No sponsors published yet.
            </div>
          )}

          {bottomContent ? (
            <Reveal delay={160}>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: bottomContent }}
              />
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
