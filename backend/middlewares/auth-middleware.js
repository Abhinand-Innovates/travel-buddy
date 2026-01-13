import jwt from 'jsonwebtoken';
import User from '../models/user-schema.js';
import GuideRequest from '../models/guide-request-schema.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if it's a regular user first
    let user = await User.findOne({ email: decoded.email });
    let isGuide = false;
    
    // If not found in User model, check GuideRequest model
    if (!user) {
      user = await GuideRequest.findOne({ email: decoded.email });
      isGuide = true;
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: 'Your account has been deleted. Please contact the support team for assistance.', accountStatus: 'deleted' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Your account is temporarily blocked. Please contact the support team for assistance.', accountStatus: 'blocked' });
    }

    // For guides, also check if they are approved
    if (isGuide && user.status !== 'approved') {
      return res.status(403).json({ message: `Your KYC is ${user.status}. Please wait for admin approval.`, accountStatus: 'pending' });
    }

    req.user = user;
    req.isGuide = isGuide;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
