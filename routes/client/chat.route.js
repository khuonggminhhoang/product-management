const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/chat.controller');
const middleware = require('./../../middlewares/client/room-chat.middleware');

router.get('/:roomChatId', middleware.isAccess, controller.index);

router.get('/', controller.home);

module.exports = router;