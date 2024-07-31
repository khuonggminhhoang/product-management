const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/users.controller');

router.get('/not-friend', controller.notFriend);

router.get('/request', controller.requestFriend);

router.get('/accept', controller.acceptFriend);

module.exports = router;