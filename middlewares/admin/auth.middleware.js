const Account = require('./../../models/account.model');
const Role = require('./../../models/role.model');

const systemConfig = require('./../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
    else{
        const account = await Account.findOne({token: token, status:'active', deleted: false}).select('-password -token');
        if(!account){
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        // đăng nhập thành công 
        const roles = await Role.findOne({_id: account.roleId}).select('title permission');

        res.locals.account = account;
        res.locals.roles = roles;

        next();
    }
}