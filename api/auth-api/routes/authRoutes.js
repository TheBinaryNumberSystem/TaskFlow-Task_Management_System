import express from 'express';
import { registerUser, loginUser, getMe, verifyEmployee } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require valid JWT)
router.get('/me', protect, getMe);
router.get('/verify-employee/:email', protect, verifyEmployee);

export default router;