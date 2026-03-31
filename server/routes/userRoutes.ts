import express, { Router } from 'express';
import {
  register,
  login,
  getUser,
  updateUser,
  changePassword,
  createOrder,
  clearOrders,
  getAllUsers,
  resetUserPassword,
  updateUserRole,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router: Router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', authMiddleware, roleMiddleware, getAllUsers);
router.patch('/:id/reset-password', authMiddleware, roleMiddleware, resetUserPassword);
router.patch('/:id/role', authMiddleware, roleMiddleware, updateUserRole);
router.patch('/:id/change-password', authMiddleware, changePassword);
router.post('/:id/orders', authMiddleware, createOrder);
router.delete('/:id/orders', authMiddleware, clearOrders);
router.get('/:id', authMiddleware, getUser);
router.patch('/:id', authMiddleware, updateUser);

export default router;
