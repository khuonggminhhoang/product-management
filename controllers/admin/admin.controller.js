const systemConfig = require('./../../config/system');

// [GET] /admin
module.exports.index = (req, res) => {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}