const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticate = require('../middlewares/authMiddleware');

// Public
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected (Teachers/Admin)
router.post('/', authenticate, courseController.uploadThumbnailMiddleware, courseController.createCourse);
router.put('/:id', authenticate, courseController.updateCourse);
router.delete('/:id', authenticate, courseController.deleteCourse);

module.exports = router;
