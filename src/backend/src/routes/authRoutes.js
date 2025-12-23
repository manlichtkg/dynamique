const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: "Trop de tentatives, réessayez plus tard."
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authController.refreshToken); // No rate limit or higher limit for refresh
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
