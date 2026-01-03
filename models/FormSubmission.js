// models/FormSubmission.js
import mongoose from 'mongoose';

const FormSubmissionSchema = new mongoose.Schema({
  formKey: { type: String, required: true, index: true }, // matches Form.key
  data: { type: mongoose.Schema.Types.Mixed, default: {} }, // raw field values
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. IP, user-agent
}, { timestamps: true });

export default mongoose.models.FormSubmission
  || mongoose.model('FormSubmission', FormSubmissionSchema);