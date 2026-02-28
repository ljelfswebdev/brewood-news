import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Banner from '@/components/Banner';
import CommitteeContent from '@/components/committee/CommitteeContent';
import TypewriterText from '@/components/animations/TypewriterText';

function normalizeMember(post) {
  const main = post?.templateData?.main || {};

  return {
    _id: String(post?._id || ''),
    title: String(post?.title || '').trim(),
    firstName: String(main.firstName || '').trim(),
    lastName: String(main.lastName || '').trim(),
    position: String(main.position || '').trim(),
    image: String(main.image || '').trim(),
    about: String(main.about || '').trim(),
  };
}

export default async function CommitteePage() {
  let committeePosts = [];
  let trusteePosts = [];
  try {
    await dbConnect();
    [committeePosts, trusteePosts] = await Promise.all([
      Post.find({
        postTypeKey: 'committee',
        status: 'published',
      })
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean(),
      Post.find({
        postTypeKey: 'trustee',
        status: 'published',
      })
        .sort({ sortOrder: 1, createdAt: 1 })
        .lean(),
    ]);
  } catch (error) {
    console.error('Committee page load failed:', error?.message || error);
  }

  const committeeMembers = (committeePosts || []).map(normalizeMember);
  const trusteeMembers = (trusteePosts || []).map(normalizeMember);

  return (
    <main>
      <Banner title="Committee" />
      <section className="py-12">
        <div className="container space-y-12">
          <div className="space-y-6">
            <TypewriterText
              as="h2"
              text="Trustees"
              className="h3 text-center"
            />
            <CommitteeContent
              members={trusteeMembers}
              emptyText="No trustees published yet."
              gridClassName="lg:grid-cols-3"
            />
          </div>

          <div className="space-y-6">
            <TypewriterText
              as="h2"
              text="Committee"
              className="h3 text-center"
            />
            <CommitteeContent
              members={committeeMembers}
              emptyText="No committee members published yet."
              gridClassName="lg:grid-cols-4"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
