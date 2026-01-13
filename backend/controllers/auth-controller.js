import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user-schema.js';
import Otp from '../models/otp-schema.js';
import { sendEmail } from '../utils/sendEmail.js';

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateJwt = (email) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const token = jwt.sign({ email }, secret, { expiresIn: '7d' });
  return token;
};

/* ======================
   SIGNUP (SEND OTP)
====================== */
export const signup = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
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

    await sendEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed' });
  }
};

/* ======================
   VERIFY OTP & CREATE USER
====================== */
export const verifyOtp = async (req, res) => {
  try {
    const { fullName, email, mobile, password, otp } = req.body;

    if (!email || !otp || !password) {
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

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      isVerified: true,
    });

    await Otp.deleteOne({ email });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

/* ======================
   LOGIN
====================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return res.status(403).json({ message: 'Your account has been deleted. Please contact the support team for assistance.' });
    }

    // Check if user is blocked
    if (user.blocked) {
      return res.status(403).json({ message: 'Your account is temporarily blocked. Please contact the support team for assistance.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateJwt(email);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};
