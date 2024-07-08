const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/client/checkout.controller');
const validate = require('./../../validates/client/order.validate');

router.get('/', controller.index);

router.post('/order', validate.orderValid, controller.order); 

module.exports = router;