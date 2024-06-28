const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

const controller = require('./../../controllers/admin/article.controller');
const middleware = require('./../../middlewares/admin/upload.middleware');
const validate = require('./../../validates/admin/article.validate');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), middleware.upload, validate.articleValid, controller.createPOST);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.delete);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'), middleware.upload, validate.articleValid , controller.editPATCH);

router.get('/detail/:id', controller.detail);

module.exports = router;