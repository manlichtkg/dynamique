const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, resourceController.uploadResourceMiddleware, resourceController.createResource);
router.get('/lesson/:lessonId', authenticate, resourceController.getResourcesByLesson);
router.delete('/:id', authenticate, resourceController.deleteResource);

module.exports = router;
