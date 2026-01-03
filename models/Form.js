// models/Form.js
import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },    // NOT required – builder allows blanks
    type: {
      type: String,
      enum: ['text', 'textarea', 'select'],
      default: 'text',
    },
    placeholder: { type: String, default: '' },
    options: [{ type: String }],             // for selects
     required: { type: Boolean, default: false },
  },
  { _id: false }
);

const RowSchema = new mongoose.Schema(
  {
    columns: { type: Number, default: 1 },
    fields: { type: [FieldSchema], default: [] },
  },
  { _id: false }
);

const AutoReplySchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    subject: { type: String, default: '' },
    message: { type: String, default: '' },
    fromName: { type: String, default: '' },
    fromEmail: { type: String, default: '' },
  },
  { _id: false }
);

const FormSchema = new mongoose.Schema(
  {
    // “title” basically
    name: { type: String, required: true },

    // key used in frontend (e.g. "contact", "quote", etc.)
    key: { type: String, required: true, unique: true },

    rows: { type: [RowSchema], default: [] },
    autoReply: { type: AutoReplySchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.Form || mongoose.model('Form', FormSchema);