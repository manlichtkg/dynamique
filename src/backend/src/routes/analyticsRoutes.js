const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middlewares/authMiddleware');

// Tracking (Public or Auth)
router.post('/events', authenticate, analyticsController.trackEvent);

// Dashboards
router.get('/admin/stats', authenticate, analyticsController.getAdminStats);
router.get('/teacher/courses/:courseId', authenticate, analyticsController.getTeacherStats);

// Reports
router.get('/reports', authenticate, analyticsController.generateReport);

module.exports = router;
