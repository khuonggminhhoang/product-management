const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/product.controller');
const middleware = require('./../../middlewares/admin/upload.middleware');
const validate = require('./../../validates/admin/product.validate');
const multer = require('multer');
// const {storage} = require('./../../helpers/storageMulter');
const upload = multer();

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteProduct);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.createPOST);  // thumbnail là name của input trong form

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.editProduct);

router.get('/detail/:id', controller.detail);

module.exports = router;