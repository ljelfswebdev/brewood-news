// components/Homepage/FeaturesSection.jsx
'use client';

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
            <p className="h3 text-xs uppercase tracking-[0.2em] text-secondary text-center">
              {subtitle}
            </p>
          )}



          {text && (
            <div
              className="prose max-w-none text-center"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}


          {(linkText || linkUrl) && (
            <div className="mt-4">
              <a
                href={linkUrl || '#'}
                className="button button--primary"
              >
                {linkText || 'Read more'}
              </a>
            </div>
          )}
        </div>


      </div>
    </section>
  );
}