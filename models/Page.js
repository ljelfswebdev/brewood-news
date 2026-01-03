// models/Page.js
import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true, index: true },

  // which template this page uses (e.g. 'homepage', 'about')
  templateKey: { type: String, default: 'default' },

  // for "default" template (optional)
  body: { type: String, default: '' },

  // structured data from FieldBuilder
  templateData: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.Page || mongoose.model('Page', PageSchema);