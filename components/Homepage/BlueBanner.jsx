// components/Homepage/BlueBanner.jsx
'use client';

import Image from '@/helpers/Image';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function BlueBanner({ data }) {
  if (!data) return null;

  const { backgroundImage, title, text, linkText, linkUrl, options } = data;

  const optionItems = Array.isArray(options) ? options : [];

  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId = null;

    function handleScroll() {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;

      // -1 .. 1-ish as it moves through viewport
      const progress = rect.top / windowHeight;

      // Parallax intensity (px). Clamp to avoid over-shifting.
      const translate = clamp(progress * -60, -60, 60);

      setOffset(translate);
    }

    function onScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        handleScroll();
      });
    }

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-32">
      {/* Background (no gaps) */}
      {backgroundImage && (
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Make the image layer taller than the section so translate never reveals empty space */}
          <div
            className="absolute -inset-y-24 inset-x-0 will-change-transform"
            style={{ transform: `translateY(${offset}px) scale(1.05)` }}
          >
            <Image
              src={backgroundImage}
              alt="Banner Background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Blue overlay */}
          <div className="absolute inset-0 bg-blue-900/60" />
        </div>
      )}

      {/* Content */}
      <div className="container relative">
        <div className="flex flex-col items-center text-center text-white space-y-6 max-w-[1084px] mx-auto">
          {/* OPTIONS REPEATER */}
          {optionItems.length > 0 && (
            <ul className="w-full mx-auto flex flex-wrap gap-x-10 gap-y-4 justify-center items-center">
              {optionItems.map((opt, idx) => (
                <li key={idx} className="flex gap-1 items-center">
                  <span>✅</span>
                  {opt?.label || ''}
                </li>
              ))}
            </ul>
          )}

          {/* TITLE */}
          {title && <div className="h3">{title}</div>}

          {/* RICH TEXT */}
          {text && (
            <div
              className="prose prose-invert max-w-none text-center"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}

          {/* LINK */}
          {(linkText || linkUrl) && (
            <Link href={linkUrl || '#'} className="button button--primary">
              {linkText || 'Learn more'}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}