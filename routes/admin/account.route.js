const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/account.controller');
const middleware = require('./../../middlewares/admin/upload.middleware');
const validate = require('./../../validates/admin/account.validate');

const multer = require('multer');
const upload = multer();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('avatar'), middleware.upload, validate.accountValid, controller.createPOST);

module.exports = router;