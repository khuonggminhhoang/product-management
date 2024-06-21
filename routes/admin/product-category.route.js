const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller');
const middleware = require('../../middlewares/admin/upload.middleware');
const validate = require('../../validates/admin/product.validate');

const multer = require('multer');
const upload = multer();

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.createPOST);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.editPOST);

router.delete('/delete/:id', controller.delete);

module.exports = router;