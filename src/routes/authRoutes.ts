import { Router } from 'express';
import { adminLogin, forgotPassword, getMe, login, logout, refreshToken, register, resetPassword, resendVerificationEmail, updateProfile, verifyEmail } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply stricter rate limiting to authentication endpoints
router.post('/login', authRateLimiter, login);
router.post('/register', authRateLimiter, register);
router.post('/refresh', authRateLimiter, refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', authRateLimiter, resendVerificationEmail);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
router.patch('/profile', requireAuth, updateProfile);
router.post('/admin/login', authRateLimiter, adminLogin);

export default router;
