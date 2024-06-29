const Account = require('./../../models/account.model');
const systemConfig = require('./../../config/system');
const md5 = require('md5');

// [GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render('./admin/pages/my-account/index.pug', {
        title: res.locals.account.fullName
    });
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
    res.render('./admin/pages/my-account/edit.pug', {
        title: 'Chỉnh sửa thông tin cá nhân'
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPATCH = async (req, res) => {
    if(req.body.password){
        req.body.password = md5(req.body.password);
    }
    else{
        delete req.body.password;
    }

    try{
        await Account.updateOne({_id: res.locals.account.id}, req.body);
        req.flash('success', 'Cập nhật tài khoản thành công');
        res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    }
    catch(err){
        req.flash('error', 'Cập nhật thất bại');
        res.redirect('back');
    }
}