// app/news/page.jsx
import dynamic from 'next/dynamic';
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import Loading from '@/components/Loading';

const NewsArchive = dynamic(
  () => import('@/components/News/NewsArchive'),
  {
    ssr: false,          // client-side for filters & pagination
    loading: () => <Loading />,
  }
);


export default async function NewsPage() {
  await dbConnect();

  const posts = await Post.find({ postTypeKey: 'news', status: 'published' })
    .sort({ publishedAt: -1 })
    .lean();

  // Strip mongoose stuff
  const safePosts = JSON.parse(JSON.stringify(posts || []));

  return <NewsArchive posts={safePosts} />;
}