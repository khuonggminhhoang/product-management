const Account = require('./../../models/account.model');

const systemConfig = require('./../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else{
        const account = await Account.findOne({token: token});
        if(!account){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        }
        next();
    }
}