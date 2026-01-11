import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import adminRoutes from './routes/adminRoute.js';
import guideRoutes from './routes/guideRoute.js';

dotenv.config();

const app = express();

// ✅ ADD THESE TWO LINES
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/guide', guideRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
