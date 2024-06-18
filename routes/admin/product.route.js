const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/product.controller');
const multer = require('multer');
const {storage} = require('./../../helpers/storageMulter');
const upload = multer({ storage: storage});

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteProduct);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), controller.createProduct);  // thumbnail là name của input trong form

module.exports = router;