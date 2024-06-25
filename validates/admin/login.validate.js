module.exports.loginPOST = (req, res, next) => {
    if(!req.body.email){
        req.flash('error', 'Email không được bỏ trống');
        res.redirect('back');
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Password không được bỏ trống');
        res.redirect('back');
        return;
    }

    next();
}