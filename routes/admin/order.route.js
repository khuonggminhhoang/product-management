const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/order.controller');
// const validate = require('./../../validates/admin/product.validate');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.delete);

// router.get('/create', controller.create);

// router.post('/create', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.createPOST);  // thumbnail là name của input trong form

// router.get('/edit/:id', controller.edit);

// router.patch('/edit/:id', upload.single('thumbnail'), middleware.upload, validate.productValid, controller.editProduct);

// router.get('/detail/:id', controller.detail);

module.exports = router;