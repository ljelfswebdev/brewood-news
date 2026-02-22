import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Banner from '@/components/Banner';
import CommitteeContent from '@/components/committee/CommitteeContent';

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
  let posts = [];
  try {
    await dbConnect();
    posts = await Post.find({
      postTypeKey: 'committee',
      status: 'published',
    })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();
  } catch (error) {
    console.error('Committee page load failed:', error?.message || error);
  }

  const members = (posts || []).map(normalizeMember);

  return (
    <main>
      <Banner title="Committee" />
      <section className="py-12">
        <div className="container">
          <CommitteeContent members={members} />
        </div>
      </section>
    </main>
  );
}
