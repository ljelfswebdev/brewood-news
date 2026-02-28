'use client';

import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

function GalleryBlock({ images = [] }) {
  const safeImages = (Array.isArray(images) ? images : [])
    .map((item) => String(item?.image || '').trim())
    .filter(Boolean);

  if (!safeImages.length) return null;

  if (safeImages.length === 1) {
    return (
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
        <Image
          src={safeImages[0]}
          alt="Club history image"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
          quality={58}
        />
      </div>
    );
  }

  if (safeImages.length === 2) {
    return (
      <>
        <div className="hidden md:grid md:grid-cols-2 gap-4">
          {safeImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-primary"
            >
              <Image
                src={src}
                alt={`Club history image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 512px"
                quality={58}
              />
            </div>
          ))}
        </div>

        <div className="md:hidden">
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={16}>
            {safeImages.map((src, index) => (
              <SwiperSlide key={`${src}-${index}`}>
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-primary">
                  <Image
                    src={src}
                    alt={`Club history image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    quality={58}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    );
  }

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
      }}
    >
      {safeImages.map((src, index) => (
        <SwiperSlide key={`${src}-${index}`}>
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-primary">
            <Image
              src={src}
              alt={`Club history image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={58}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default function ClubHistoryContent({ blocks = [] }) {
  const items = Array.isArray(blocks) ? blocks : [];

  return (
    <div className="mx-auto  space-y-8">
      {items.map((block, index) => {
        if (block?.blockType === 'richText' && String(block?.content || '').trim()) {
          return (
            <div
              key={`block-${index}`}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: String(block.content || '') }}
            />
          );
        }

        if (block?.blockType === 'gallery') {
          return (
            <GalleryBlock key={`block-${index}`} images={block?.gallery || []} />
          );
        }

        return null;
      })}
    </div>
  );
}
