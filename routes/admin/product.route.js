const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/product.controller');
const validate = require('./../../validates/admin/product.validate');
const multer = require('multer');
const {storage} = require('./../../helpers/storageMulter');
const upload = multer({ storage: storage});

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteProduct);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), validate.productValid, controller.createProduct);  // thumbnail là name của input trong form

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'), validate.productValid, controller.editProduct);

module.exports = router;