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

module.exports = router;