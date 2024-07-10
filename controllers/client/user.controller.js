const md5 = require('md5');
const jwt = require('jsonwebtoken');

const User = require('./../../models/user.model');
const ForgotPassword = require('./../../models/forgot-password.model');

const StringRandomHelper = require('./../../helpers/stringRandom');
const { TypedEventEmitter } = require('mongodb');

// [GET] /user/login
module.exports.login = (req, res) => {
    res.clearCookie('tokenUser');

    res.render('./client/pages/users/login.pug', {
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

        res.redirect('/');
    }
    catch(err) {
        res.sendStatus(500);
    }
    
}

// [GET] /user/register
module.exports.register = (req, res) => {
    res.clearCookie('tokenUser');
    res.render('./client/pages/users/register.pug', {
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
        
        res.cookie('tokenUser', tokenUser);
        req.flash('success', 'Đăng ký tài khoản thành công');
        res.redirect('/');
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser');

    res.redirect('/user/login');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.clearCookie('tokenUser');

    res.render('./client/pages/users/forgot-password.pug', {
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

        res.redirect(`/user/password/otp?email=${email}`);
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render('./client/pages/users/otp-password.pug', {
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

    const user = await User.findOne({
        email: email
    });

    res.cookie('tokenUser', user.tokenUser);
    res.redirect('/user/password/reset');
}