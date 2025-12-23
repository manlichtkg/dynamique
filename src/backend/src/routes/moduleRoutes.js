const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authenticate = require('../middlewares/authMiddleware');

// Modules
router.post('/modules', authenticate, moduleController.createModule);
router.put('/modules/:id', authenticate, moduleController.updateModule);
router.delete('/modules/:id', authenticate, moduleController.deleteModule);

// Lessons
router.post('/lessons', authenticate, moduleController.createLesson);
router.put('/lessons/:id', authenticate, moduleController.updateLesson);
router.delete('/lessons/:id', authenticate, moduleController.deleteLesson);

module.exports = router;
