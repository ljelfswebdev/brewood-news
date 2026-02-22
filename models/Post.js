// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },

    // e.g. "news", "services"
    postTypeKey: { type: String, required: true },

    // usually same as postTypeKey (points to which template to use)
    templateKey: { type: String, required: true },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },

    // we’ll store as Date but you send "YYYY-MM-DD" from the form
    publishedAt: { type: Date, default: Date.now },

    // optional manual ordering for list-type post types (e.g. committee)
    sortOrder: { type: Number, default: 0 },

    // all your FieldBuilder content lives here
    templateData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
