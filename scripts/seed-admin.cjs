require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','editor'], default: 'admin' },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

(async () => {
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    const email = process.env.ADMIN_SEED_EMAIL || 'lewis@example.com';
    const plain = process.env.ADMIN_SEED_PASSWORD || '12345';
    const hash = await bcrypt.hash(plain, 10);
    await User.findOneAndUpdate(
      { email },
      { email, passwordHash: hash, role: 'admin' },
      { upsert: true, new: true }
    );
    console.log('Admin user seeded:', email, 'password:', plain);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
