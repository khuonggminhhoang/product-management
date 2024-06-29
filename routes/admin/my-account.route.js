const express = require('express');
const router = express.Router();
const middleware = require('./../../middlewares/admin/upload.middleware');
const validate = require('./../../validates/admin/account.validate');
const multer = require('multer');
const upload = multer();

const controller = require('./../../controllers/admin/my-account.controller');

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch('/edit', upload.single('avatar'), middleware.upload, validate.myAccountValidPATCH, controller.editPATCH);

module.exports = router;