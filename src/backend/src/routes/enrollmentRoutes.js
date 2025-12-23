const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, enrollmentController.enrollUser);
router.get('/', authenticate, enrollmentController.getUserEnrollments);
router.get('/:courseId/status', authenticate, enrollmentController.checkEnrollmentStatus);

module.exports = router;
