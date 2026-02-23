// components/Homepage/HeroSection.jsx
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import '@/styles/pages/homepage.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Image from '@/helpers/Image';

export default function HeroSection({ data }) {
  const slides = Array.isArray(data?.slides) ? data.slides : [];

  if (!slides.length) {
    return (
      <section className="bg-black text-white">
        <div className="container py-16">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            Hero not configured
          </h1>
          <p className="text-sm text-white/70">
            Go to the homepage page in admin and add some slides in{' '}
            <strong> Section 1 → Hero Slides</strong>.
          </p>
        </div>
      </section>
    );
  }

  const shouldLoop = slides.length > 1;

  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Zoom keyframes (scoped to this component) */}
      <style jsx>{`
        @keyframes heroKenBurns {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.08);
          }
        }
        .hero-zoom {
          animation: heroKenBurns 10s ease-in-out infinite alternate;
          will-change: transform;
        }
      `}</style>

      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        className="h-full"
        slidesPerView={1}
        spaceBetween={0}
        loop={shouldLoop}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={
          shouldLoop
            ? {
                delay: 10000, // ✅ every 10 seconds
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        speed={900} // nice fade speed
        pagination={{
          clickable: true,
          el: '.hero-pagination',
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="h-full">
            <div className="relative flex items-center h-full">
              {/* Background image */}
              {slide.backgroundImage && (
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 hero-zoom">
                    <Image
                      src={slide.backgroundImage}
                      alt={slide.title || `Slide ${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={1920}
                      height={600}
                      sizes="100vw"
                      quality={50}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      priority={idx === 0}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}
              <div className="absolute top-0 left-0 h-full w-full  bg-secondary/40"></div>

              {/* Content */}
              <div className="container">
                <div className="relative z-[2] py-16 text-white space-y-4 flex flex-col items-center justify-center">
                  {slide.title && <h1 className="h2 text-center">{slide.title}</h1>}

                  {slide.text && (
                    <div
                      className="prose prose-invert text-center"
                      dangerouslySetInnerHTML={{ __html: slide.text }}
                    />
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="container absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="hero-pagination flex gap-2" />
      </div>
    </section>
  );
}
