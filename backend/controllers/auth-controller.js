import bcrypt from 'bcryptjs';
import User from '../models/user-schema.js';
import { sendEmail } from '../utils/sendEmail.js';

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 👉 SIGNUP (SEND OTP)
export const signup = async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.findOneAndUpdate(
      { email },
      {
        fullName,
        mobile,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed' });
  }
};

// 👉 VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
