const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer();

const controller = require('./../../controllers/admin/setting.controller');
const middleware = require('./../../middlewares/admin/upload.middleware');


router.get('/general', controller.general);

router.patch('/general', upload.fields([{name: 'favicon'}, {name: 'logo'}]), middleware.uploadMulti , controller.generalPATCH);


module.exports = router;