// app/news/page.jsx
import { dbConnect } from '@helpers/db';
import Post from '@/models/Post';
import NewsArchive from '@/components/News/NewsArchive';


export default async function NewsPage() {
  let posts = [];
  try {
    await dbConnect();
    posts = await Post.find({ postTypeKey: 'news', status: 'published' })
      .sort({ publishedAt: -1 })
      .lean();
  } catch (error) {
    console.error('News page load failed:', error?.message || error);
  }

  // Strip mongoose stuff
  const safePosts = JSON.parse(JSON.stringify(posts || []));

  return <NewsArchive posts={safePosts} />;
}
