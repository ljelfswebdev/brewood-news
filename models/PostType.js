// models/PostType.js
import mongoose from 'mongoose';

const PostTypeSchema = new mongoose.Schema(
  {
    // e.g. "news", "services" — used in URLs: /news/my-article
    key: { type: String, required: true, unique: true, index: true },
    // e.g. "News"
    label: { type: String, required: true },
    // template key inside your /templates/postTypes index
    templateKey: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PostType || mongoose.model('PostType', PostTypeSchema);