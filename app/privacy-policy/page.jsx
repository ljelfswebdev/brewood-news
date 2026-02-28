import Banner from '@/components/Banner';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  await dbConnect();

  const page =
    (await Page.findOne({ slug: 'privacy-policy' }).lean()) ||
    (await Page.findOne({ templateKey: 'legals' }).sort({ createdAt: 1 }).lean());

  const pageTitle = String(page?.title || '').trim() || 'Privacy Policy';
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
                No privacy policy content has been added yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
