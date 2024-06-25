const express = require('express');
const router = express.Router();

const validate = require('./../../validates/admin/login.validate');

const controller = require('./../../controllers/admin/auth.controller');

router.get('/login', controller.login);

router.post('/login', validate.loginPOST, controller.loginPOST);

module.exports = router;