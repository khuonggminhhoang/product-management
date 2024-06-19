const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/trash.controller');

router.get('/products', controller.trashProducts);

router.patch('/products/restore/:id', controller.restoredProducts);

router.delete('/products/delete-permanent/:id', controller.deletedProducts);           // xóa vĩnh viễn một sản phẩm

module.exports = router;