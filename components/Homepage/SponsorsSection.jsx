// components/Homepage/SponsorsSection.jsx
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import SponsorsSectionClient from '@/components/Homepage/SponsorsSectionClient';

export const dynamic = 'force-dynamic';

export default async function SponsorsSection() {
  await dbConnect();

  const sponsors = await Post.find(
    { postTypeKey: 'sponsors', status: 'published' },
    {
      title: 1,
      slug: 1,
      publishDate: 1,
      createdAt: 1,
      templateData: 1, // includes main.image/main.link/main.content/main.isPrimarySponsor
    }
  )
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(80)
    .lean();

  // ✅ make serializable
  const safeSponsors = JSON.parse(JSON.stringify(sponsors));

  return <SponsorsSectionClient sponsors={safeSponsors} />;
}