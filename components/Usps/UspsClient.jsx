// components/Usps/UspsClient.jsx
'use client';

import { useRef } from 'react';
import Image from '@/helpers/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import '@/styles/components/usps.css';

import 'swiper/css';
import 'swiper/css/navigation';

export default function UspsClient({ items }) {
  const usps = Array.isArray(items) ? items : [];
  if (!usps.length) return null;

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <motion.section
      className="py-4 usps"
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "0px 0px -25% 0px", // 🔥 triggers when 25% from bottom
      }}
    >
      <div className="container">
        <div className="flex items-center gap-4">
          {/* Left nav */}
          <button
            ref={prevRef}
            type="button"
            className="usp-prev items-center justify-center rounded-full border border-grey w-10 h-10 hover:bg-grey transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#1f317c" />
              <path fill="#fff" d="M16.293 19.296c-.39.39-.39 1.025 0 1.416l6 6a1.002 1.002 0 0 0 1.416-1.416l-5.294-5.294 5.29-5.293a1.002 1.002 0 0 0-1.415-1.416l-6 6z" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            navigation={{
              prevEl: '.usp-prev',
              nextEl: '.usp-next',
            }}
            className="flex-1"
          >
            {usps.map((usp, idx) => (
              <SwiperSlide key={idx}>
                <motion.div
                  className="flex items-center gap-3 h-full justify-center"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                        delay: idx * 0.25, // stagger
                        ease: 'easeOut',
                      },
                    },
                  }}
                >
                  {usp.image && (
                    <div className="flex-shrink-0 w-12 h-12 relative">
                      <Image
                        src={usp.image}
                        alt={usp.text || `USP ${idx + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="text-sm leading-snug">{usp.text}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right nav */}
          <button
            ref={nextRef}
            type="button"
            className="usp-next rotate-180 items-center justify-center rounded-full border border-grey w-10 h-10 hover:bg-grey transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="20" fill="#1f317c" />
              <path fill="#fff" d="M16.293 19.296c-.39.39-.39 1.025 0 1.416l6 6a1.002 1.002 0 0 0 1.416-1.416l-5.294-5.294 5.29-5.293a1.002 1.002 0 0 0-1.415-1.416l-6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </motion.section>
  );
}