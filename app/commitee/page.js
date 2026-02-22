import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Banner from '@/components/Banner';
import CommitteeContent from '@/components/committee/CommitteeContent';

function normalizeMember(post) {
  const main = post?.templateData?.main || {};

  const firstName = String(main.firstName || '').trim();
  const lastName = String(main.lastName || '').trim();
  const position = String(main.position || '').trim();
  const image = String(main.image || '').trim();
  const about = String(main.about || '').trim();

  return {
    _id: String(post?._id || ''),
    title: String(post?.title || '').trim(),
    firstName,
    lastName,
    position,
    image,
    about,
  };
}

export default async function CommiteePage() {
  await dbConnect();

  const posts = await Post.find({
    postTypeKey: 'committee',
    status: 'published',
  })
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean();

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
