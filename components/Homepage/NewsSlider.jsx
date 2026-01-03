// components/Homepage/NewsSlider.jsx
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import NewsSliderClient from '@/components/Homepage/NewsSliderClient';

export const dynamic = 'force-dynamic'; // optional if you want always-fresh

export default async function NewsSlider() {
  await dbConnect();

  const posts = await Post.find(
    { postTypeKey: 'news', status: 'published' },
    {
      // ✅ only what we need for cards
      title: 1,
      slug: 1,
      templateData: 1,
      publishDate: 1,
      createdAt: 1,
    }
  )
    .sort({ publishDate: -1, createdAt: -1 })
    .limit(6)
    .lean();

  // ✅ guaranteed serializable
  const safePosts = JSON.parse(JSON.stringify(posts));

  return <NewsSliderClient posts={safePosts} />;
}