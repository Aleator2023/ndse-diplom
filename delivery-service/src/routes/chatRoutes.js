const express = require('express');
const router = express.Router();
const { getChat, sendMessage } = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/chat', authenticate, getChat);
router.post('/chat/message', authenticate, sendMessage);

module.exports = router;