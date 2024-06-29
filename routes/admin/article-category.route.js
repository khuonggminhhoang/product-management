const express = require('express');
const router = express.Router();

const controller = require('./../../controllers/admin/article-category.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.createPOST);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', controller.editPATCH);

router.delete('/delete/:id', controller.delete);

router.patch('/change-multi', controller.changeMulti)

module.exports = router;