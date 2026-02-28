// components/Homepage/SponsorsSectionClient.jsx
'use client';

import Link from 'next/link';
import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Reveal from '@/components/animations/Reveal';
import TypewriterText from '@/components/animations/TypewriterText';

import 'swiper/css';
import 'swiper/css/pagination';

function isExternal(url = '') {
  return /^https?:\/\//i.test(String(url));
}

function PrimarySponsorCard({ sponsor }) {
  const main = sponsor?.templateData?.main || {};
  const href = main.link || '#';
  const img = main.image;
  const title = sponsor?.title || 'Sponsor';
  const rich = main.content || '';

  return (
    <div className="card overflow-hidden rounded-primary border-2 border-primary p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-full md:w-[320px] aspect-[4/3] rounded-primary overflow-hidden bg-gray-100 shrink-0">
          {img ? (
            <Image
              src={img}
              alt={title}
              fill
              className="object-contain"
              priority
            />
          ) : null}
        </div>

        <div className="w-full space-y-4">
          <TypewriterText
            as="div"
            text={title}
            className="h4 text-primary"
            delay={120}
          />

          {/* ✅ no limiting for primary */}
          {rich ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: rich }}
            />
          ) : null}

          {href && href !== '#' ? (
            <Link
              href={href}
              target={isExternal(href) ? '_blank' : undefined}
              rel={isExternal(href) ? 'noopener noreferrer' : undefined}
              className="button button--secondary max-md:w-full"
            >
              Visit Site
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SponsorCard({ sponsor }) {
  const main = sponsor?.templateData?.main || {};
  const href = main.link || '#';
  const img = main.image;
  const title = sponsor?.title || 'Sponsor';

  // ✅ render rich HTML for description (no <p>)
  const descHtml = main.content || '';

  return (
    <article className="card overflow-hidden rounded-primary border-2 border-primary hover:shadow-md transition h-full">
      <div className="flex flex-col p-6 gap-4 h-full">
        <div className="relative w-full aspect-[4/3] rounded-primary overflow-hidden bg-gray-100">
          {img ? (
            <Image
              src={img}
              alt={title}
              fill
              className="object-contain"
            />
          ) : null}
        </div>

        <div className="gap-2 flex flex-col grow">
          <TypewriterText
            as="div"
            text={title}
            className="h5"
            delay={120}
          />

          {descHtml ? (
            <div
              className="prose prose-sm max-w-none text-gray-600 line-clamp-4"
              dangerouslySetInnerHTML={{ __html: descHtml }}
            />
          ) : null}

          <div className="pt-2 mt-auto">
            {href && href !== '#' ? (
              <Link
                href={href}
                target={isExternal(href) ? '_blank' : undefined}
                rel={isExternal(href) ? 'noopener noreferrer' : undefined}
                className="button button--secondary w-full"
              >
                Visit Site
              </Link>
            ) : (
              <span className="button button--secondary w-full opacity-50 pointer-events-none">
                Visit Site
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SponsorsSectionClient({ sponsors = [] }) {
  const list = Array.isArray(sponsors) ? sponsors : [];

  const primary =
    list.find((p) => p?.templateData?.main?.isPrimarySponsor) || null;

  const others = list.filter((p) => String(p?._id) !== String(primary?._id));

  return (
    <section className="py-12">
      <div className="container space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <TypewriterText
              as="div"
              text="Our Supporters"
              className="h3 text-primary"
            />
            <Reveal delay={100}>
              <p className="">
              Thanks to the businesses supporting Brewood Cricket Club.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="">
              If you would like to support the club, then please get in touch. 
              </p>
            </Reveal>
          </div>
        </div>

        {/* ✅ PRIMARY (full width, full content) */}
        {primary && (
          <Reveal delay={140}>
            <PrimarySponsorCard sponsor={primary} />
          </Reveal>
        )}

        {/* ✅ OTHERS (swiper) */}
        {others.length > 0 && (
          <div className="relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              className="!pb-[10px]"
              pagination={{ clickable: true, el: '.sponsors-pagination' }}
              autoplay={
                others.length > 3
                  ? {
                      delay: 8000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              loop={others.length > 3}
              spaceBetween={16}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {others.map((s) => (
                <SwiperSlide key={String(s._id)} className="!h-auto">
                  <SponsorCard sponsor={s} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-6 flex justify-center w-fit mx-auto">
              <div className="sponsors-pagination flex gap-2" />
            </div>

          </div>
        )}

        <Reveal className="flex justify-center" delay={220}>
          <Link href="/our-supporters" className="button button--primary">
            View All Supporters
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
