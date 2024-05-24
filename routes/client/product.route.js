const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/product.controller.js')

router.use('/', controller.index)

module.exports = router