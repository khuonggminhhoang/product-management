const Account = require('./../../models/account.model');
const Role = require('./../../models/role.model');
const systemConfig = require('./../../config/system');

const md5 = require('md5')                            // hàm băm md5 để mã hóa mật khẩu thành string 32 ký tự
const jwt = require('jsonwebtoken');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try {
        const records = await Account.find({deleted: false});
        for(const record of records){
            const role = await Role.findOne({_id: record.roleId, deleted: false});
            if(role){
                record.role = role.title;   
            }
        }

        res.render('./admin/pages/accounts/index.pug', {
            title: 'Tài khoản',
            records: records
        });
    }
    catch(err){
        res.status(404).json('NOT FOUND');
        console.log(err);
    }
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    try {
        const records = await Role.find({deleted: false});

        res.render('./admin/pages/accounts/create.pug', {
            title: 'Thêm tài khoản',
            records: records
        })
    }
    catch(err) {
        res.status(404).json('NOT FOUND');
    }

}

// [POST] /admin/accounts/create
module.exports.createPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('account_create')){
        req.body.password = md5(req.body.password);
    
        const payload = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone
        }
    
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        req.body.token = token;
    
        // const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decoded);
        // 2 dòng trên để xác minh với payload ban đầu [tham khảo] https://www.npmjs.com/package/jsonwebtoken
    
        try{
            const account = new Account(req.body);
            await account.save();
            req.flash('success', 'Tạo tài khoản thành công');
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
        catch(err){
            res.redirect('back');
        }
    }
    else{
        return;
    }
}

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res)=> {
    if(res.locals.roles.permission.includes('account_delete')){
        try {
            await Account.updateOne({_id: req.params.id}, {deleted: true, deleteAt: new Date()});
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

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.roles.permission.includes('account_edit')){
        try{
            const id = req.params.id;
            const status = req.params.status;
            await Account.updateOne({_id: id}, {status: status});
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

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try{    
        const records = await Role.find({deleted: false});
        const account = await Account.findOne({_id: req.params.id}).select('-token -password');

        res.render('./admin/pages/accounts/edit.pug', {
            title: 'Chỉnh sửa tài khoản',
            account: account,
            records: records
        })
    }
    catch(err){
        res.status(404).json('NOT FOUND');
    }
    
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('account_edit')){
        if(req.body.password){
            req.body.password = md5(req.body.password);
        }
        else{
            delete req.body.password;
        }
    
        try{
            await Account.updateOne({_id: req.params.id}, req.body);
            req.flash('success', 'Cập nhật tài khoản thành công');
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
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

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const id = req.params.id;
        const account = await Account.findOne({_id: id}).select('-password -token');
        const role = await Role.findOne({_id: account.roleId});
        account.role = role.title

        res.render('./admin/pages/accounts/detail.pug', {
            title: 'Thông tin tài khoản',
            account: account
        })
    }
    catch(err){
        res.status(404).json('NOT FOUND');
    }
}
