import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import GuideRequest from '../models/guide-request-schema.js';
import User from '../models/user-schema.js';
import Otp from '../models/otp-schema.js';
import { sendEmail } from '../utils/sendEmail.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ======================
   STEP 1: Save Guide Details Temporarily
====================== */
export const saveGuideDetails = async (req, res) => {
  try {
    const { fullName, email, mobile, fullAddress, password, confirmPassword } = req.body;

    if (!fullName || !email || !mobile || !fullAddress || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email already exists in users or guide requests
    const existingUser = await User.findOne({ email });
    const existingGuide = await GuideRequest.findOne({ email });
    if (existingUser || existingGuide) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Store temporarily in session or return success with data
    // For simplicity, we'll proceed to next steps
    return res.status(200).json({ message: 'Details saved temporarily' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save details' });
  }
};

/* ======================
   STEP 2: Upload Selfie
====================== */
export const uploadSelfie = [
  upload.single('selfie'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Selfie image is required' });
      }

      const selfieUrl = '/' + req.file.path;
      return res.status(200).json({ message: 'Selfie uploaded', selfieUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload selfie' });
    }
  }
];

/* ======================
   STEP 3: Upload Aadhaar
====================== */
export const uploadAadhaar = [
  upload.fields([
    { name: 'aadhaarFront', maxCount: 1 },
    { name: 'aadhaarBack', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files.aadhaarFront || !req.files.aadhaarBack) {
        return res.status(400).json({ message: 'Both Aadhaar images are required' });
      }

      const aadhaarFrontUrl = '/' + req.files.aadhaarFront[0].path;
      const aadhaarBackUrl = '/' + req.files.aadhaarBack[0].path;

      return res.status(200).json({
        message: 'Aadhaar uploaded',
        aadhaarFrontUrl,
        aadhaarBackUrl
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload Aadhaar' });
    }
  }
];

/* ======================
   STEP 4: Send OTP for Guide
====================== */
export const sendGuideOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingOtp = await Otp.findOne({ email });
    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return res.status(429).json({
        message: 'Please wait before requesting a new OTP',
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 90 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt },
      { upsert: true, new: true }
    );

    try {
      await sendEmail(email, otp);
      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // For development: Store OTP in response for testing
      return res.status(200).json({
        message: 'Email service unavailable. Use OTP: ' + otp,
        devOtp: otp
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

/* ======================
   STEP 5: Verify OTP and Save Guide Request
====================== */
export const verifyGuideOtp = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      fullAddress,
      password,
      selfieUrl,
      aadhaarFrontUrl,
      aadhaarBackUrl,
      otp
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const guideRequest = await GuideRequest.create({
      fullName,
      email,
      mobile,
      fullAddress,
      passwordHash: hashedPassword,
      selfieUrl,
      aadhaarFrontUrl,
      aadhaarBackUrl,
      status: 'pending'
    });



    await Otp.deleteOne({ email });

    return res.status(201).json({ message: 'Guide request submitted successfully' });
  } catch (error) {
    console.error('Guide OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

/* ======================
   ADMIN: Get All Pending Guides
====================== */
export const getPendingGuides = async (req, res) => {
  try {
    const guides = await GuideRequest.find({ status: 'pending' });
    return res.status(200).json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ message: 'Failed to fetch guides' });
  }
};

/* ======================
   ADMIN: Approve Guide
====================== */
export const approveGuide = async (req, res) => {
  try {
    const { id } = req.params;

    const guide = await GuideRequest.findById(id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide request not found' });
    }

    // Create user account
    await User.create({
      fullName: guide.fullName,
      email: guide.email,
      mobile: guide.mobile,
      password: guide.passwordHash,
      isVerified: true,
      // Add role as guide if needed, but for now assume regular user
    });

    // Update status
    guide.status = 'approved';
    await guide.save();

    return res.status(200).json({ message: 'Guide approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve guide' });
  }
};

/* ======================
   ADMIN: Reject Guide
====================== */
export const rejectGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const guide = await GuideRequest.findById(id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide request not found' });
    }

    guide.status = 'rejected';
    guide.rejectionReason = reason || 'Application rejected by admin';
    await guide.save();

    return res.status(200).json({ message: 'Guide rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject guide' });
  }
};

/* ======================
   GUIDE: Get KYC Status
====================== */
export const getGuideKycStatus = async (req, res) => {
  try {
    const { email } = req.params;

    const guideRequest = await GuideRequest.findOne({ email });

    if (!guideRequest) {
      return res.status(404).json({ message: 'Guide request not found' });
    }

    return res.status(200).json({
      status: guideRequest.status,
      rejectionReason: guideRequest.rejectionReason,
      submittedAt: guideRequest.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch KYC status' });
  }
};

/* ======================
   ADMIN: Get All Guides (Approved, Pending, Rejected)
====================== */
export const getAllGuides = async (req, res) => {
  try {
    const guides = await GuideRequest.find({});
    return res.status(200).json(guides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch guides' });
  }
};
