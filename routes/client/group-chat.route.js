const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/group-chat.controller');

router.get('/create', controller.create);

router.post('/create', controller.createPOST);

module.exports = router;