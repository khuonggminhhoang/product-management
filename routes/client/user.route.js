const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/user.controller');
const validate = require('./../../validates/client/user.validate'); 

router.get('/login', controller.login);

router.post('/login', validate.loginPOST, controller.loginPOST);

router.get('/register', controller.register);

router.post('/register',  validate.registerPOST, controller.registerPOST)

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot', validate.forgotPasswordPOST, controller.forgotPasswordPOST);

router.get('/password/otp', controller.otpPassword);

router.post('/password/otp', validate.otpPasswordPOST, controller.otpPasswordPOST);

router.get('/password/reset', controller.resetPassword);

router.post('/password/reset', validate.resetPassword,controller.resetPasswordPOST);

module.exports = router;