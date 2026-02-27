import Banner from '@/components/Banner';
import ClubHistoryContent from '@/components/ClubHistory/ClubHistoryContent';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';

export const dynamic = 'force-dynamic';

export default async function ClubHistoryPage() {
  await dbConnect();

  const page =
    (await Page.findOne({ slug: 'club-history' }).lean()) ||
    (await Page.findOne({ templateKey: 'clubHistory' }).sort({ createdAt: 1 }).lean());

  const pageTitle = String(page?.title || '').trim() || 'Club History';
  const templateData = page?.templateData || {};
  const blocks = templateData?.blocks?.items || [];

  return (
    <>
      <Banner title={pageTitle} />

      <section className="py-12">
        <div className="container">
          <ClubHistoryContent blocks={blocks} />
        </div>
      </section>
    </>
  );
}
