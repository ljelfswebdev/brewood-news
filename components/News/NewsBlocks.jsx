'use client';

import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export default function NewsBlocks({ blocks }) {
  return (
    <div className="space-y-10">
      {blocks.map((block, i) => {
        if (block.blockType === 'richText' && block.content) {
          return (
            <div
              key={i}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          );
        }

        if (block.blockType === 'imageGallery' && block.gallery?.length) {
          // Single image
          if (block.gallery.length === 1) {
            return (
              <div
                key={i}
                className="relative w-full aspect-[16/9] overflow-hidden rounded-primary"
              >
                <Image
                  src={block.gallery[0].image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  quality={58}
                />
              </div>
            );
          }

          // Multiple images → Swiper
          return (
            <Swiper
              key={i}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
            >
              {block.gallery.map((img, j) => (
                <SwiperSlide key={j}>
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-primary">
                    <Image
                      src={img.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 896px"
                      quality={58}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          );
        }

        return null;
      })}
    </div>
  );
}
