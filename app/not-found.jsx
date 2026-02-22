'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from '@/helpers/Image';

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="pt-28 pb-16">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-primary border-2 border-primary">
            <Image
              src="/404.png"
              alt="Page not found"
              width={1200}
              height={700}
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="space-y-2">
            <h1 className="h2 text-primary">Page Not Found</h1>
            <p className="text-gray-600">
              The page you are looking for does not exist or has moved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="button button--primary">
              Go To Home
            </Link>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
