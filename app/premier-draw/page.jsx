import Banner from '@/components/Banner';
import Link from 'next/link';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function PremierDrawPage() {
  await dbConnect();

  const page =
    (await Page.findOne({ slug: 'premier-draw' }).lean()) ||
    (await Page.findOne({ templateKey: 'premierDraw' }).sort({ createdAt: 1 }).lean());

  const pageTitle = String(page?.title || '').trim() || 'Premier Draw';
  const templateData = page?.templateData || {};
  const body = String(templateData?.content?.body || '').trim();

  return (
    <>
      <Banner title={pageTitle} />

      <section className="py-12">
        <div className="container">
          <div className="mx-auto">
            {body ? (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <div className="card text-sm text-gray-600">
                No premier draw content has been added yet.
              </div>
            )}

            <div className="pt-8">
              <Link href="/contact-us" className="button button--primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
