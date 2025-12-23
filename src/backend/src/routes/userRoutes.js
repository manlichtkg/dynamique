const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, userController.getMe);
router.post('/me/avatar', authenticate, userController.uploadAvatarMiddleware, userController.updateProfile);
router.put('/me', authenticate, userController.updateProfile);
router.get('/leaderboard', userController.getLeaderboard);

module.exports = router;
