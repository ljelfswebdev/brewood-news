// components/News/Card.jsx
import Link from 'next/link';
import Image from '@/helpers/Image';
import Reveal from '@/components/animations/Reveal';
import TypewriterText from '@/components/animations/TypewriterText';

export default function NewsCard({ post, delay = 0 }) {
  if (!post) return null;

  const intro = post?.templateData?.intro || {};
  const main = post?.templateData?.main || {};

  const introImage = intro?.introImage || main?.featuredImage;
  const introText = intro?.introText || main?.excerpt || '';

  const snippet =
    introText.length > 180 ? `${introText.slice(0, 177)}…` : introText;

  return (
    <Reveal as="article" className="card flex flex-col h-full hover:shadow-md transition" delay={delay}>
      <Reveal delay={80} variant="fade-in">
        <Link
          href={`/news/${post.slug}`}
          className="block mb-3 relative w-full aspect-[4/3] overflow-hidden rounded-lg"
        >
          {introImage ? (
            <Image
              src={introImage}
              alt={post.title || 'News image'}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
              quality={58}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
        </Link>
      </Reveal>

      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/news/${post.slug}`} className="hover:text-primary">
            <TypewriterText
              as="span"
              text={post.title || ''}
              delay={120 + delay}
            />
          </Link>
        </h3>

        {snippet && (
          <Reveal delay={180}>
            <p className="text-sm text-gray-600 flex-1">{snippet}</p>
          </Reveal>
        )}

        <Reveal className="mt-4" delay={240}>
          <Link
            href={`/news/${post.slug}`}
            className="button button--primary w-full"
            aria-label={`Read more about ${post.title || 'this news post'}`}
          >
            Read Article
          </Link>
        </Reveal>
      </div>
    </Reveal>
  );
}
