const Account = require('./../../models/account.model');
const User = require('./../../models/user.model');
const Role = require('./../../models/role.model');
const systemConfig = require('./../../config/system');

const md5 = require('md5')                            // hàm băm md5 để mã hóa mật khẩu thành string 32 ký tự
const jwt = require('jsonwebtoken');

const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');

// [GET] /admin/users
module.exports.index = async (req, res) => {
    try {
        const records = await User.find({deleted: false});
        for(const record of records){
            const role = await Role.findOne({_id: record.roleId, deleted: false});
            if(role){
                record.role = role.title;   
            }
        }

        res.render('./admin/pages/users/index.pug', {
            title: 'Tài khoản người dùng',
            records: records
        });
    }
    catch(err){
        res.status(404).json('NOT FOUND');
        console.log(err);
    }
}

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
    try {
        res.render('./admin/pages/users/create.pug', {
            title: 'Thêm tài khoản người dùng',
        });
    }
    catch(err) {
        res.status(404).json('NOT FOUND');
    }

}

// [POST] /admin/users/create
module.exports.createPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('user_create')){
        req.body.password = md5(req.body.password);
    
        const payload = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone
        }
    
        const tokenUser = jwt.sign(payload, process.env.SECRET_KEY);
        req.body.tokenUser = tokenUser;
    
        try{
            const user = new User(req.body);
            await user.save();
            req.flash('success', 'Tạo tài khoản thành công');
            res.redirect(`${systemConfig.prefixAdmin}/users`);
        }
        catch(err){
            res.redirect('back');
        }
    }
    else{
        return;
    }
}

// [DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res)=> {
    if(res.locals.roles.permission.includes('user_delete')){
        try {
            await User.updateOne({_id: req.params.id}, {deleted: true, deleteAt: new Date()});
            req.flash('success', 'Xóa tài khoản thành công');
        }
        catch(err){
            req.flash('error', 'Xóa tài khoản thất bại');
        }
        res.redirect('back');
    }
    else{
        return;
    }
}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.roles.permission.includes('user_edit')){
        try{
            const id = req.params.id;
            const status = req.params.status;
            await User.updateOne({_id: id}, {status: status});
            req.flash('success', 'Thay đổi trạng thái thành công');
        }
        catch(err){
            req.flash('error', 'Thay đổi trạng thái thất bại')
        }
        res.redirect('back');
    }
    else{
        return;
    }
}

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
    try{    
        const user = await User.findOne({_id: req.params.id}).select('-tokenUser -password');
        user.dob = dateTimeFormatterHelper.formatDate(user.dateOfBirth);

        res.render('./admin/pages/users/edit.pug', {
            title: 'Chỉnh sửa tài khoản',
            user: user,
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}

// [PATCH] /admin/users/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('user_edit')){
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }
        else{
            delete req.body.password;
        }
    
        try{
            await User.updateOne({_id: req.params.id}, req.body);
            req.flash('success', 'Cập nhật tài khoản thành công');
            res.redirect(`${systemConfig.prefixAdmin}/users`);
        }
        catch(err){
            req.flash('error', 'Cập nhật thất bại');
            res.redirect('back');
        }
    }
    else{
        return;
    }
}

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await User.findOne({_id: id}).select('-password -tokenUser');
        user.dob = dateTimeFormatterHelper.formatDate(user.dateOfBirth);
        
        res.render('./admin/pages/users/detail.pug', {
            title: 'Thông tin tài khoản',
            user: user
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}
