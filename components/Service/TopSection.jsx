// components/Service/TopSection.jsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '@/styles/pages/service.css';

import Image from '@/helpers/Image';

export default function ServiceTopSection({ title, gallery, description }) {
  const slides = Array.isArray(gallery) ? gallery : [];

  return (
    <section className="py-16">
      <div className="container">
        <div className="gap-10 flex flex-col md:flex-row items-start">
          
          {/* LEFT: Gallery Swiper */}
          <div className="relative w-full md:w-1/2 min-w-1/2">

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.service-prev',
                nextEl: '.service-next',
              }}
              spaceBetween={16}
              slidesPerView={1}
              className="w-full h-full"
            >
              {slides.map((item, idx) => {
                const img = item?.image;
                if (!img) return null;

                return (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full aspect-square overflow-hidden rounded-primary">
                      <Image
                        src={img}
                        alt={title || `Gallery image ${idx + 1}`}
                        className="object-cover h-full w-full"
                        height={600}
                        width={600}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* --- Navigation Arrows --- */}
            <button
              className="
                service-prev z-10
                absolute left-4 top-1/2 -translate-y-1/2
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1f317c"/><path fill="#fff" d="M16.293 19.296c-.39.39-.39 1.025 0 1.416l6 6a1.002 1.002 0 0 0 1.416-1.416l-5.294-5.294 5.29-5.293a1.002 1.002 0 0 0-1.415-1.416l-6 6z"/></svg>
            </button>

            <button
              className="
                service-next z-10
                absolute right-4 top-1/2 -translate-y-1/2 rotate-180
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1f317c"/><path fill="#fff" d="M16.293 19.296c-.39.39-.39 1.025 0 1.416l6 6a1.002 1.002 0 0 0 1.416-1.416l-5.294-5.294 5.29-5.293a1.002 1.002 0 0 0-1.415-1.416l-6 6z"/></svg>
            </button>

          </div>

          {/* RIGHT: Description */}
          <div className="space-y-4 grow">
            {title && (
              <h2 className="h4">{title}</h2>
            )}

            {description && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}