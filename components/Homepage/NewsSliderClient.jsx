'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import NewsCard from '@/components/News/Card';

export default function NewsSliderClient({ posts }) {
  const items = Array.isArray(posts) ? posts : [];
  if (!items.length) return null;

  const shouldLoop = items.length > 3;

  return (
    <section className="py-12 relative">
      <div className="container space-y-8">
        <h2 className="h3 text-center">Latest News</h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={16}
          loop={shouldLoop}
          autoplay={
            shouldLoop
              ? { delay: 10000, disableOnInteraction: false }
              : false
          }
          pagination={{
            clickable: true,
            el: '.news-pagination', // ✅ CUSTOM TARGET
          }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {items.map((post) => (
            <SwiperSlide key={post._id} className="h-auto">
              <NewsCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ✅ PAGINATION – centered */}
        <div className="flex justify-center w-fit mx-auto">
          <div className="news-pagination flex gap-2" />
        </div>
      </div>
    </section>
  );
}