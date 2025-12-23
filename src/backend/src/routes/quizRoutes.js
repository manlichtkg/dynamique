const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authenticate = require('../middlewares/authMiddleware');

// Quiz Management
router.post('/', authenticate, quizController.createQuiz);
router.post('/questions', authenticate, quizController.addQuestion);
router.get('/lesson/:lessonId', authenticate, quizController.getQuizByLesson);

// Attempts
router.post('/attempt', authenticate, quizController.submitAttempt);

module.exports = router;
