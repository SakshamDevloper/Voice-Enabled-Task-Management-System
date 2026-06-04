const express = require('express');
const router = express.Router();
const { register, login, oauthLogin, refreshToken, getMe, updateProfile, sendOTP, verifyOTP } = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/oauth', oauthLogin);
router.post('/refresh-token', protect, refreshToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

