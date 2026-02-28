'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from '@/helpers/Image';
import { useRef } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ClubHireContent({
  body = '',
  images = [],
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const safeImages = useMemo(
    () =>
      (Array.isArray(images) ? images : [])
        .map((item) => String(item?.image || '').trim())
        .filter(Boolean),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(null);

  const hasModal = Number.isInteger(activeIndex) && safeImages[activeIndex];

  function closeModal() {
    setActiveIndex(null);
  }

  function goPrev() {
    if (!safeImages.length || activeIndex === null) return;
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  }

  function goNext() {
    if (!safeImages.length || activeIndex === null) return;
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  }

  useEffect(() => {
    if (!hasModal) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasModal, activeIndex, safeImages.length]);

  return (
    <>
      <div className="space-y-8">
        {String(body || '').trim() && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: String(body || '') }}
          />
        )}

        <div>
          <Link href="/contact-us" className="button button--primary">
            Contact Us
          </Link>
        </div>

        {safeImages.length > 0 && (
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              navigation
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3.5 },
              }}
            >
              {safeImages.map((src, index) => (
                <SwiperSlide key={`${src}-${index}`}>
                  <button
                    type="button"
                    className="relative block w-full aspect-[4/3] overflow-hidden rounded-primary"
                    onClick={() => setActiveIndex(index)}
                  >
                    <Image
                      src={src}
                      alt={`Club hire image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      quality={58}
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              ref={prevRef}
              className="absolute left-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2"
              aria-label="Previous gallery images"
            >
              <Image
                src="/arrow.svg"
                alt="Previous"
                width={40}
                height={40}
                className="h-10 w-10 rotate-180"
              />
            </button>

            <button
              type="button"
              ref={nextRef}
              className="absolute right-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2"
              aria-label="Next gallery images"
            >
              <Image
                src="/arrow.svg"
                alt="Next"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </button>
          </div>
        )}
      </div>

      {hasModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="relative w-full max-w-6xl rounded-primary bg-white p-3 md:p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Club hire image preview"
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-20 h-10 w-10"
              onClick={closeModal}
              aria-label="Close image preview"
            >
              <Image
                src="/close.svg"
                alt="Close"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </button>

            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <Image
                src="/arrow.svg"
                alt="Previous"
                width={40}
                height={40}
                className="h-10 w-10 rotate-180"
              />
            </button>

            <div className="relative h-[70vh] w-full overflow-hidden rounded-primary">
              <Image
                src={safeImages[activeIndex]}
                alt={`Club hire image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={68}
                priority
              />
            </div>

            <button
              type="button"
              className="absolute right-2 top-1/2 z-20 h-12 w-12 -translate-y-1/2"
              onClick={goNext}
              aria-label="Next image"
            >
              <Image
                src="/arrow.svg"
                alt="Next"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
