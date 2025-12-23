const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, messageController.getConversations);
router.post('/', authenticate, messageController.startConversation);
router.get('/:conversationId/messages', authenticate, messageController.getMessages);
router.post('/messages', authenticate, messageController.sendMessage);

module.exports = router;
