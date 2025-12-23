const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, progressController.updateProgress);
router.get('/:courseId', authenticate, progressController.getCourseProgress);

module.exports = router;
