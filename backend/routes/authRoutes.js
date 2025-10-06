import express from 'express';
import { signup, verifyOTP, resendOTP } from '../controllers/signupController.js';
import { login, forgotPassword, resetPassword, logout, getCurrentUser } from '../controllers/loginController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;