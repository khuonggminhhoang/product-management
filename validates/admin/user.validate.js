const User = require('./../../models/user.model');

module.exports.userValid = async (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'Vui lòng điền họ tên');
        res.redirect('back');
        return;
    }
    
    if(!req.body.email){
        req.flash('error', 'Vui lòng điền email');
        res.redirect('back');
        return;
    }
    else{
        const acc = await User.findOne({deleted: false, email: req.body.email});
        if(acc){
            req.flash('error', `Email ${req.body.email} đã tồn tại`);
            res.redirect('back');
            return;
        }
    }

    if(!req.body.phone){
        req.flash('error', 'Vui lòng nhập số điện thoại');
        res.redirect('back');
        return;
    }
    else{
        const regex = /^(0|\+84)\d{3}[ ]?\d{3}[ ]?\d{3}$/;
        if(!regex.test(req.body.phone)){
            req.flash('error', 'Vui lòng nhập đúng số điện thoại');
            res.redirect('back');
            return;
        }
    }

    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu');
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

module.exports.userValidPATCH =  async (req, res, next) => {
    if(!req.body.fullName){
        req.flash('error', 'Vui lòng điền họ tên');
        res.redirect('back');
        return;
    }
    
    if(!req.body.email){
        req.flash('error', 'Vui lòng điền email');
        res.redirect('back');
        return;
    }
    else{
        const acc = await User.findOne({deleted: false, email: req.body.email, _id: { $ne: req.params.id }});   
        // $ne là not equals, ở đây lấy ra các bản ghi không trùng với bản ghi của record đang xét
        if(acc){
            req.flash('error', `Email ${req.body.email} đã tồn tại`);
            res.redirect('back');
            return;
        }
    }

    if(!req.body.phone){
        req.flash('error', 'Vui lòng nhập số điện thoại');
        res.redirect('back');
        return;
    }
    else{
        const regex = /^(0|\+84)\d{3}[ ]?\d{3}[ ]?\d{3}$/;
        if(!regex.test(req.body.phone)){
            req.flash('error', 'Vui lòng nhập đúng số điện thoại');
            res.redirect('back');
            return;
        }
    }


    if(req.body.password){
        const password = req.body.password;
        if(password.length < 8){
            req.flash('error', 'Mật khẩu cần ít nhất 8 ký tự');
            res.redirect('back');
            return;
        }
    }

    // còn update
    next();
}