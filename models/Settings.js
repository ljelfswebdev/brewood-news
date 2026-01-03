// models/Settings.js
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // 'global'
    templateKey: { type: String, required: true },       // 'global'
    templateData: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// IMPORTANT: must match 'Settings' (plural) everywhere
export default mongoose.models.Settings
  || mongoose.model('Settings', SettingsSchema);