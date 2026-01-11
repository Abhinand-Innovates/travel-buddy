import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GuideRequest from '../models/guide-request-schema.js';

dotenv.config();

const updateImagePaths = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Update all guide requests to ensure paths start with '/'
    const guides = await GuideRequest.find({});

    for (const guide of guides) {
      let updated = false;

      if (guide.selfieUrl && !guide.selfieUrl.startsWith('/')) {
        guide.selfieUrl = '/' + guide.selfieUrl;
        updated = true;
      }

      if (guide.aadhaarFrontUrl && !guide.aadhaarFrontUrl.startsWith('/')) {
        guide.aadhaarFrontUrl = '/' + guide.aadhaarFrontUrl;
        updated = true;
      }

      if (guide.aadhaarBackUrl && !guide.aadhaarBackUrl.startsWith('/')) {
        guide.aadhaarBackUrl = '/' + guide.aadhaarBackUrl;
        updated = true;
      }

      if (updated) {
        await guide.save();
        console.log(`Updated guide: ${guide.email}`);
      }
    }

    console.log('Image paths update completed');
  } catch (error) {
    console.error('Error updating image paths:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateImagePaths();
