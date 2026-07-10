const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/v1/auth/login           — credential check, issues OTP for gov roles
router.post('/login',           controller.login);

// POST /api/v1/auth/verify-otp      — verify OTP, issue JWT tokens
router.post('/verify-otp',      controller.verifyOtp);

// POST /api/v1/auth/refresh          — refresh access token
router.post('/refresh',         controller.refresh);

// POST /api/v1/auth/forgot-password  — trigger password reset
router.post('/forgot-password', controller.forgotPassword);

// POST /api/v1/auth/logout           — client-side session clear
router.post('/logout',          controller.logout);

// GET  /api/v1/auth/me               — current user (requires token)
router.get('/me',               verifyToken, controller.me);

module.exports = router;
