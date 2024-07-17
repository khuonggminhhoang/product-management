const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

const controller = require('./../../controllers/client/user.controller');
const validate = require('./../../validates/client/user.validate'); 
const middlewareUpload = require('./../../middlewares/client/upload.middleware');
const middlewareAuth = require('./../../middlewares/client/auth.middleware');

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

router.post('/password/reset', validate.resetPassword, controller.resetPasswordPOST);

router.get('/password/change', controller.changePassword);

router.post('/password/change', validate.changePassword,controller.changePasswordPOST);

router.get('/password/change/otp', controller.otpChangePassword);

router.post('/password/change/otp', controller.otpChangePasswordPOST);

router.get('/info', middlewareAuth.requireAuth, controller.info);

router.patch('/info', middlewareAuth.requireAuth, upload.single('avatar'), middlewareUpload.upload, controller.infoPATCH);

module.exports = router;