import express from 'express';
import { registerUser, loginUser, getMe, verifyEmployee } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected routes (require valid JWT)
router.get('/me', protect, getMe);
router.get('/verify-employee/:email', protect, verifyEmployee);

export default router;