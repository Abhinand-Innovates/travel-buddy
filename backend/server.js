import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import adminRoutes from './routes/adminRoute.js';

dotenv.config();

const app = express();

// ✅ ADD THESE TWO LINES
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
