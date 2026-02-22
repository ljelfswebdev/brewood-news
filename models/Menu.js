// models/Menu.js
import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  id: { type: String, required: true },                 // unique per item
  label: { type: String, required: true },
  url: { type: String, default: '' },
  target: { type: String, default: '_self' },
  type: { type: String, default: 'custom' },            // 'page', 'post', 'custom' etc
  parentId: { type: String, default: null },            // to allow nesting
  order: { type: Number, default: 0 },
}, { _id: false });

const MenuSchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },     // e.g. 'main-menu'
  label: { type: String, required: true },              // "Main Menu"
  items: { type: [MenuItemSchema], default: [] },
}, { timestamps: true });

const existing = mongoose.models.Menu;

if (
  existing &&
  !existing.schema.path('items')?.schema?.path('target')
) {
  delete mongoose.models.Menu;
}

export default mongoose.models.Menu || mongoose.model('Menu', MenuSchema);
