const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/badges', authenticateToken, gamificationController.getBadges);
router.get('/challenges', authenticateToken, gamificationController.getChallenges);
router.get('/activity', authenticateToken, gamificationController.getActivity);

module.exports = router;
