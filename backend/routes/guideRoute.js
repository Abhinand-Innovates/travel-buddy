import express from 'express';
import {
  saveGuideDetails,
  uploadSelfie,
  uploadAadhaar,
  sendGuideOtp,
  verifyGuideOtp,
  getPendingGuides,
  approveGuide,
  rejectGuide,
  getGuideKycStatus,
  getAllGuides
} from '../controllers/guide-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Public routes
router.post('/details', saveGuideDetails);
router.post('/upload-selfie', uploadSelfie);
router.post('/upload-aadhaar', uploadAadhaar);
router.post('/send-otp', sendGuideOtp);
router.post('/verify-otp', verifyGuideOtp);
router.get('/kyc-status/:email', getGuideKycStatus);

// Admin routes
router.get('/pending', authenticateToken, requireAdmin, getPendingGuides);
router.get('/all', authenticateToken, requireAdmin, getAllGuides);
router.put('/approve/:id', authenticateToken, requireAdmin, approveGuide);
router.put('/reject/:id', authenticateToken, requireAdmin, rejectGuide);

export default router;
