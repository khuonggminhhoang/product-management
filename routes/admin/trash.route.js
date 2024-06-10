const express = require('express');
const router = express.Router();
const controller = require('./../../controllers/admin/trash.controller');

router.get('/products', controller.trashProducts);

module.exports = router;