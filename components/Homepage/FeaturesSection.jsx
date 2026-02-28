// components/Homepage/FeaturesSection.jsx
'use client';

import Reveal from '@/components/animations/Reveal';
import TypewriterText from '@/components/animations/TypewriterText';

export default function FeaturesSection({ data }) {
  if (!data) return null;

  const {
    subtitle,
    text,
    linkText,
    linkUrl,

  } = data;


  return (
    <section className="py-12">
      <div className="container">
        <div className="space-y-4 flex flex-col items-center justify-center">
          {subtitle && (
            <>
              <div className="hidden lg:block">
                <TypewriterText
                  as="p"
                  text={subtitle}
                  className="h3 text-xs uppercase tracking-[0.2em] text-secondary text-center"
                />
              </div>
              <div className="lg:hidden">
                <Reveal>
                  <p className="h3 text-xs uppercase tracking-[0.2em] text-secondary text-center">
                    {subtitle}
                  </p>
                </Reveal>
              </div>
            </>
          )}

          {text && (
            <Reveal delay={120}>
              <div
                className="prose max-w-none text-center"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </Reveal>
          )}

          {(linkText || linkUrl) && (
            <Reveal className="mt-4" delay={220}>
              <a
                href={linkUrl || '#'}
                className="button button--primary"
              >
                {linkText || 'Read more'}
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
