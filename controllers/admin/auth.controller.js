const md5 = require('md5');
const Account = require('./../../models/account.model');

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render('./admin/pages/auth/login.pug', {
        title: 'Đăng nhập'
    })
}

// [POST] /admin/auth/login
module.exports.loginPOST = async (req, res) => {
    try{
        let {email, password} = req.body;
        password = md5(password);
        const acc = await Account.findOne({email: email, password: password, status: 'active', deleted: false});
        if(!acc){
            req.flash('error', 'Email hoặc Password sai');
            res.redirect('back');
            return;
        }

        res.cookie('token', acc.token);
        res.redirect('/admin/dashboard');
    }
    catch(err){
        res.status(500).json(err);
    }
}