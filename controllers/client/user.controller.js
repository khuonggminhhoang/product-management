const md5 = require('md5');
const jwt = require('jsonwebtoken');

const User = require('./../../models/user.model');
const ForgotPassword = require('./../../models/forgot-password.model');
const Cart = require('./../../models/cart.model');

const StringRandomHelper = require('./../../helpers/stringRandom');
const sendMailHelper = require('./../../helpers/sendMail');
const formatDateTimeHelper = require('./../../helpers/dateTimeFormatter');

// [GET] /user/login
module.exports.login = (req, res) => {
    res.clearCookie('tokenUser');

    res.render('./client/pages/user/login.pug', {
        title: 'Đăng nhập'
    });
}

// [POST] /user/login
module.exports.loginPOST = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    try{
        const user = await User.findOne({
            email: email,
            deleted: false,
        });

        if(!user){
            req.flash('error', 'Email chưa được đăng ký');
            res.redirect('back');
            return;
        }

        if(user.password != password){
            req.flash('error', 'Sai mật khẩu');
            res.redirect('back');
            return;
        }

        if(user.status != 'active'){
            req.flash('error', 'Tài khoản đã bị khóa');
            res.redirect('back');
            return;
        }

        res.cookie('tokenUser', user.tokenUser);
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            userId: user.id
        })

        // update trạng thái online
        await User.updateOne({_id: user.id}, {statusOnline: 'online'});

        _io.once('connection', (socket) => {
            socket.broadcast.emit('SERVER_RETURN_USER_ONLINE', user.id);
        });

        res.redirect('/');
    }
    catch(err) {
        res.sendStatus(500);
    }
    
}

// [GET] /user/register
module.exports.register = (req, res) => {
    res.clearCookie('tokenUser');

    res.render('./client/pages/user/register.pug', {
        title: 'Đăng ký'
    })
}

// [POST] /user/register
module.exports.registerPOST = async (req, res) => {
    try{
        const email = req.body.email;
        
        const user = await User.findOne({email: email});
        if(user){
            req.flash('error', `Email ${email} đã tồn tại`);
            res.redirect('back');
            return;
        }
        
        if(md5(req.body.password) != md5(req.body['enter-password'])){
            req.flash('error', 'Mật khẩu không khớp, nhập lại mật khẩu');
            res.redirect('back');
            return;
        }
        
        delete req.body['enter-password'];
        req.body.password = md5(req.body.password);
        
        const payload = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone
        }
        
        const tokenUser = jwt.sign(payload, process.env.SECRET_KEY);
        req.body.tokenUser = tokenUser;
        
        const userRecord = new User(req.body);
        await userRecord.save();
        
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            userId: userRecord.id
        });

        res.cookie('tokenUser', tokenUser);
        req.flash('success', 'Đăng ký tài khoản thành công');
        res.redirect('/');

    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    // offline user khi đăng xuất
    await User.updateOne({_id: res.locals.user.id}, {statusOnline: 'offline'});

    _io.once('connection', (socket) => {
        socket.broadcast.emit('SERVER_RETURN_USER_OFFLINE', res.locals.user.id);
    });

    res.clearCookie('tokenUser');
    res.clearCookie('cartId');

    res.redirect('/user/login');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.clearCookie('tokenUser');

    res.render('./client/pages/user/forgot-password.pug', {
        title: 'Xác thực email'
    })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPOST = async (req, res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({
            email: email,
            deleted: false,
        });

        if(!user){
            req.flash('error', 'Email chưa được đăng ký tài khoản');
            res.redirect('back');
            return;
        }

        if(user.status != 'active'){
            req.flash('error', 'Tài khoản được tạo bởi email này bị khóa');
            res.redirect('back');
            return;
        }
        const otp = StringRandomHelper.ramdomNumber(8);
        const forgotPassword = new ForgotPassword({
            email: email,
            otp: otp,
            expireAt: Date.now()
        });

        await forgotPassword.save();

        // Gửi otp qua mail
        const toEmail = email;
        const subject = '[K_TECOM] OTP đổi mật khẩu'
        const html = `
                        Mã OTP của bạn: 
                        <b>${otp}</b>. 
                        <br>
                        Lưu ý: OTP chỉ có hiệu lực trong 60s
                        <hr>
                        FACEBOOK: <a href='https://www.facebook.com/khuongminhminh.hoang/'> [ADMIN_K_TECH]
        `   
        sendMailHelper.sendMail(toEmail, subject, html);

        res.redirect(`/user/password/otp?email=${email}`);
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render('./client/pages/user/otp-password.pug', {
        title: 'Nhập mã OTP',
        email: email
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPOST = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    
    const record = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!record){
        req.flash('error', 'OTP không hợp lệ');
        res.redirect('back');
        return;
    }

    // const user = await User.findOne({
    //     email: email
    // });

    // res.cookie('tokenUser', user.tokenUser);
    res.cookie('email', btoa(email));
    res.redirect('/user/password/reset');
}

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render('./client/pages/user/reset-password.pug', {
        title: 'Cập nhật mật khẩu'
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPOST = async (req, res) => {
    try {
        const password = req.body.password;
        const email = atob(req.cookies.email);
        
        const user = await User.findOne({
            email: email,
        });
    
        if(user.password == md5(password)) {
            req.flash('error', 'Mật khẩu này đã được dùng')
            res.redirect('back');
            return;
        }
        
        await User.updateOne({
            email: email
        }, {
            password: md5(password)
        });
    
    
        res.cookie('tokenUser', user.tokenUser);
        req.flash('success', 'Cập nhật mật khẩu thành công');
        res.redirect('/');
    }
    catch(err) {
        res.status(500).json('Lỗi /user/password/reset');
    }
}

// [GET] /user/info
module.exports.info = (req, res) => {
    const user = res.locals.user;
    user.dob = formatDateTimeHelper.formatDate(user.dateOfBirth);
    
    res.render('./client/pages/user/info.pug', {
        title: 'Hồ sơ cá nhân',
        user: user
    })
}

// [PATCH] /user/info
module.exports.infoPATCH = async (req, res) => {
    try {
        if(!req.body.phone) {
            delete req.body.phone;
        } 
        
        await User.updateOne({
            tokenUser: req.cookies.tokenUser
        }, req.body);

        req.flash('success', 'Cập nhật hồ sơ thành công');
        res.redirect('back');
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /user/password/change
module.exports.changePassword = (req, res) => {
    res.render('./client/pages/user/change-password.pug', {
        title: 'Thay đổi mật khẩu'
    });
}

// [POST] /user/password/change
module.exports.changePasswordPOST = async (req, res) => {
    try {

        const user = await User.findOne({email: req.body.email, deleted: false, status: 'active'});
        if(user) {
            if(user.password != md5(req.body.oldPassword)) {
                req.flash('error', 'Sai mật khẩu cũ');
                res.redirect('back');
                return;
            }
    
            if(req.body.oldPassword ==  req.body.newPassword) {
                req.flash('error', 'Mật khẩu mới từng được dùng');
                res.redirect('back');
                return;
            }
    
            if(req.body.newPassword !=  req.body.confirmPassword) {
                req.flash('error', 'Xác nhận mật khẩu chưa chính xác');
                res.redirect('back');
                return;
            }   

            const otp = StringRandomHelper.ramdomNumber(8);
            const forgotPassword = new ForgotPassword({
                email: req.body.email,
                otp: otp,
                expireAt: Date.now()
            });
    
            await forgotPassword.save();

            const subject = '[K_TECOM] OTP đổi mật khẩu'
            const html = `
                            Mã OTP của bạn: 
                            <b>${otp}</b>. 
                            <br>
                            Lưu ý: OTP chỉ có hiệu lực trong 60s
                            <hr>
                            FACEBOOK: <a href='https://www.facebook.com/khuongminhminh.hoang/'> [ADMIN_K_TECH]
            `   
    
            sendMailHelper.sendMail(req.body.email, subject, html);

            const payload = {
                newPassword: req.body.newPassword
            }
            
            const npw = jwt.sign(payload, process.env.SECRET_KEY);
            res.cookie('npw', npw);
            res.redirect(`/user/password/change/otp?email=${req.body.email}`);
        }
        else {
            throw new Error('[ERR] not found user');
        }
    }
    catch(err) {
        console.log(err.messages);
        res.sendStatus(500);
    }

}

// [GET] /user/password/change/otp
module.exports.otpChangePassword = (req, res) => {
    const email = req.query.email;
    res.render('./client/pages/user/otp-change-password.pug', {
        title: 'Xác thực email',
        email: email
    });
}

// [POST] /user/password/change/otp
module.exports.otpChangePasswordPOST = async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;
    const forgotPassword = await ForgotPassword.findOne({email: email, otp: otp}); 
    if(forgotPassword) {
        const token = req.cookies.npw;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const newPassword = decoded.newPassword;
        
        await User.updateOne({email: req.body.email}, {
            password: md5(newPassword)
        });
        req.flash('success', 'Đổi mật khẩu thành công');
        res.clearCookie('npw');
        res.redirect('/user/login');
    }
    else {
        req.flash('error', 'OTP không hợp lệ');
        res.redirect('back');
    }

}