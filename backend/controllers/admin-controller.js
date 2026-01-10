import User from '../models/user-schema.js';

/* ======================
   GET ALL USERS
====================== */
export const getAllUsers = async (req, res) => {
  try {
    // Get all users except password field and exclude deleted users
    const users = await User.find({ isDeleted: false }).select('-password');
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users,
      totalUsers: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/* ======================
   GET USER BY ID
====================== */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

/* ======================
   UPDATE USER (e.g., make admin)
====================== */
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isAdmin, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin, isVerified },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

/* ======================
   BLOCK/UNBLOCK USER
====================== */
export const blockUnblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Toggle blocked status
    user.blocked = !user.blocked;
    await user.save();

    // Fetch updated user without password
    const updatedUser = await User.findById(userId).select('-password');

    res.status(200).json({
      success: true,
      message: user.blocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

/* ======================
   SOFT DELETE USER
====================== */
export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/* ======================
   DELETE USER (HARD DELETE)
====================== */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};
