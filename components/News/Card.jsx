// components/News/Card.jsx
import Link from 'next/link';
import Image from '@/helpers/Image';

export default function NewsCard({ post }) {
  if (!post) return null;

  const intro = post?.templateData?.intro || {};
  const main = post?.templateData?.main || {};

  const introImage = intro?.introImage || main?.featuredImage;
  const introText = intro?.introText || main?.excerpt || '';

  const snippet =
    introText.length > 180 ? `${introText.slice(0, 177)}…` : introText;

  return (
    <article className="card flex flex-col h-full">
      <Link
        href={`/news/${post.slug}`}
        className="block mb-3 relative w-full aspect-[4/3] overflow-hidden rounded-lg"
      >
        {introImage ? (
          <Image
            src={introImage}
            alt={post.title || 'News image'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </Link>

      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/news/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>

        {snippet && <p className="text-sm text-gray-600 flex-1">{snippet}</p>}

        <div className="mt-4">
          <Link
            href={`/news/${post.slug}`}
            className="button button--primary w-full"
            aria-label={`Read more about ${post.title || 'this news post'}`}
          >
            Read Article
          </Link>
        </div>
      </div>
    </article>
  );
}
