const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/cart.controller');

router.get('/', controller.index);

router.post('/add/:id', controller.addPOST);

router.get('/delete/:id', controller.delete);

module.exports = router;