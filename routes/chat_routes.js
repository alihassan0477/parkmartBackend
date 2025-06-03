const express = require('express');
const router = express.Router();
const messageController = require('../controller/message_controller');

router.get('/chats/:userId', messageController.getChats);
router.get('/messages/:user1/:user2', messageController.getMessages);

module.exports = router;
