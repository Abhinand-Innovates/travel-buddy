import express from 'express';
import {
  guideLogin,
  saveGuideDetails,
  uploadSelfie,
  uploadAadhaar,
  sendGuideOtp,
  verifyGuideOtp,
  getPendingGuides,
  approveGuide,
  rejectGuide,
  getGuideKycStatus,
  getAllGuides,
  blockUnblockGuide,
  softDeleteGuide,
} from '../controllers/guide-controller.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Public routes
router.post('/login', guideLogin);
router.post('/details', saveGuideDetails);
router.post('/upload-selfie', uploadSelfie);
router.post('/upload-aadhaar', uploadAadhaar);
router.post('/send-otp', sendGuideOtp);
router.post('/verify-otp', verifyGuideOtp);
router.get('/kyc-status/:email', getGuideKycStatus);

// Admin routes
router.put('/approve/:id', authenticateToken, requireAdmin, approveGuide);
router.put('/reject/:id', authenticateToken, requireAdmin, rejectGuide);
router.put('/:id/block', authenticateToken, requireAdmin, blockUnblockGuide);
router.put('/:id/soft-delete', authenticateToken, requireAdmin, softDeleteGuide);
router.get('/pending', authenticateToken, requireAdmin, getPendingGuides);
router.get('/all', authenticateToken, requireAdmin, getAllGuides);

export default router;
