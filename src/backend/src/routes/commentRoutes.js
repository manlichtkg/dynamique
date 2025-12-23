const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, commentController.postComment);
router.get('/lesson/:lessonId', authenticate, commentController.getCommentsByLesson); // Can be public? Assuming auth for now
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
