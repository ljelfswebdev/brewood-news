import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','editor'], default: 'admin' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
