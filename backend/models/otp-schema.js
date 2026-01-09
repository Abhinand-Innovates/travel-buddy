import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '90s' }, // ⏰ auto-delete after 1.30 min
    },
  },
  { timestamps: true }
);

export default mongoose.model('Otp', otpSchema);
