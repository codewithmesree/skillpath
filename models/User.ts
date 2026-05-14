import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
}, { timestamps: true });



export default mongoose.models.User || mongoose.model('User', UserSchema);

