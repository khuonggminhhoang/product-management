const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/user.controller');
const middleware = require('./../../middlewares/admin/upload.middleware');
const validate = require('./../../validates/admin/user.validate');

const multer = require('multer');
const upload = multer();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('avatar'), validate.userValid, middleware.upload, controller.createPOST);

router.delete('/delete/:id', controller.delete);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('avatar'), validate.userValidPATCH, middleware.upload, controller.editPATCH);

// router.get('/detail/:id', controller.detail);

module.exports = router;