import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUnblockUser,
  softDeleteUser,
} from '../controllers/admin-controller.js';

const router = express.Router();

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId', updateUser);
router.put('/users/:userId/block', blockUnblockUser);
router.put('/users/:userId/soft-delete', softDeleteUser);
router.delete('/users/:userId', deleteUser);

export default router;
