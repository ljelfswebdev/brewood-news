import Banner from '@/components/Banner';
import ClubHireContent from '@/components/ClubHire/ClubHireContent';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function ClubHirePage() {
  await dbConnect();

  const page =
    (await Page.findOne({ slug: 'club-hire' }).lean()) ||
    (await Page.findOne({ templateKey: 'clubHire' }).sort({ createdAt: 1 }).lean());

  const pageTitle = String(page?.title || '').trim() || 'Club Hire';
  const templateData = page?.templateData || {};
  const body = templateData?.content?.body || '';
  const images = templateData?.gallery?.items || [];

  return (
    <>
      <Banner title={pageTitle} />

      <section className="py-12">
        <div className="container">
          <ClubHireContent body={body} images={images} />
        </div>
      </section>
    </>
  );
}
