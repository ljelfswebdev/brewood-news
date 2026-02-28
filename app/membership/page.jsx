import Banner from '@/components/Banner';
import Link from 'next/link';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function MembershipPage() {
  await dbConnect();

  const page =
    (await Page.findOne({ slug: 'membership' }).lean()) ||
    (await Page.findOne({ templateKey: 'membership' }).sort({ createdAt: 1 }).lean());

  const pageTitle = String(page?.title || '').trim() || 'Membership';
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
                No membership content has been added yet.
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
