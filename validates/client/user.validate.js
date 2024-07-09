module.exports.loginPOST = (req, res, next) => {
    if(!req.body.email){
        req.flash('error', 'Email không được bỏ trống');
        res.redirect('back');
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Mật khẩu không được bỏ trống');
        res.redirect('back');
        return;
    }
    else{
        const password = req.body.password;
        if(password.length < 8){
            req.flash('error', 'Mật khẩu cần ít nhất 8 ký tự');
            res.redirect('back');
            return;
        }
    }

    next();
}

module.exports.registerPOST = (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'Họ tên không được bỏ trống');
        res.redirect('back');
        return;
    }

    if(!req.body.email){
        req.flash('error', 'Email không được bỏ trống');
        res.redirect('back');
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Mật khẩu không được bỏ trống');
        res.redirect('back');
        return;
    }
    else{
        const password = req.body.password;
        if(password.length < 8){
            req.flash('error', 'Mật khẩu cần ít nhất 8 ký tự');
            res.redirect('back');
            return;
        }
    }

    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại');
        res.redirect('back');
        return;
    }
    else {
        const regex = /^(0|\+84)(3|9|8)\d{2}[ ]?\d{3}[ ]?\d{3}$/;
        if (!regex.test(req.body.phone)) {
            req.flash('error', 'Vui lòng nhập đúng số điện thoại');
            res.redirect('back');
            return;
        }
    }


    next();
}