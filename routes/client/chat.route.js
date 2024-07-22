const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/chat.controller');
const middlewareAuth = require('./../../middlewares/client/auth.middleware');

router.get('/', controller.index);

module.exports = router;