import mongoose from 'mongoose';

const guideRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    selfieUrl: {
      type: String,
      required: true,
    },
    aadhaarFrontUrl: {
      type: String,
      required: true,
    },
    aadhaarBackUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('GuideRequest', guideRequestSchema);
