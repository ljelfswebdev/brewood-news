// scripts/update-news-images.cjs
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

// Minimal Post model just for this script
const PostSchema = new mongoose.Schema(
  {
    postTypeKey: String,
    templateData: mongoose.Schema.Types.Mixed,
    title: String,
  },
  { strict: false }
);

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// OLD fake base + NEW real image
const OLD_BASE =
  'https://res.cloudinary.com/ljelfs/image/upload/v1763300000/';
const NEW_URL =
  'https://res.cloudinary.com/ljelfs/image/upload/v1763582387/blog_uploads/g4brnnqvphrr9c6mgfrm.jpg';

// Recursively walk an object/array and replace any fake intro/featured URLs
function replaceInValue(val) {
  if (typeof val === 'string') {
    if (
      val.startsWith(OLD_BASE + 'news_intro_') ||
      val.startsWith(OLD_BASE + 'news_featured_')
    ) {
      return { changed: true, value: NEW_URL };
    }
    return { changed: false, value: val };
  }

  if (Array.isArray(val)) {
    let anyChanged = false;
    const nextArr = val.map((item) => {
      const { changed, value } = replaceInValue(item);
      if (changed) anyChanged = true;
      return value;
    });
    return { changed: anyChanged, value: nextArr };
  }

  if (val && typeof val === 'object') {
    let anyChanged = false;
    const nextObj = { ...val };
    for (const key of Object.keys(nextObj)) {
      const { changed, value } = replaceInValue(nextObj[key]);
      if (changed) anyChanged = true;
      nextObj[key] = value;
    }
    return { changed: anyChanged, value: nextObj };
  }

  return { changed: false, value: val };
}

(async () => {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    console.log('✅ Connected to MongoDB');

    const posts = await Post.find({ postTypeKey: 'news' }).lean();
    console.log(`Found ${posts.length} news posts to inspect…`);

    let updatedCount = 0;

    for (const post of posts) {
      const td = post.templateData || {};
      const { changed, value: newTemplateData } = replaceInValue(td);

      if (!changed) continue;

      await Post.updateOne(
        { _id: post._id },
        { $set: { templateData: newTemplateData } }
      );

      updatedCount++;
      console.log(`✔ Updated images for: ${post.title}`);
    }

    console.log(`🎉 Done – updated ${updatedCount} news posts.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating news images');
    console.error(err);
    process.exit(1);
  }
})();