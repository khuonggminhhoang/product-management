const Role = require('./../../models/role.model');
const Account = require('./../../models/account.model');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');

const systemConfig = require('./../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        const records = await Role.find({
            deleted: false 
        })

        for(let item of records){
            const accountCreate = await Account.findOne({_id: item.createdBy.accountId});
            if(accountCreate){
                item.accountFullNameCreate = accountCreate.fullName;
                item.createAt = dateTimeFormatterHelper.formatDateTime(item.createdBy.createAt);
            }

            const accountUpdate = await Account.findOne({_id: item.updatedBy.accountId});
            if(accountUpdate){
                item.accountFullNameUpdate = accountUpdate.fullName;
                item.updateAt = dateTimeFormatterHelper.formatDateTime(item.updatedBy.updateAt);
            }

        }

        res.render('./admin/pages/roles/index.pug', {
            title: 'Nhóm quyền',
            records: records
        })
    }
    catch(err){
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
}

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render('./admin/pages/roles/create.pug', {
        title: 'Thêm quyền'
    })
}

// [POST] /admin/roles/create
module.exports.createPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('role_create')){
        try{
            const currAccount = res.locals.account;
            req.body.createdBy = {
                accountId: currAccount.id,
                createAt: new Date()
            }
    
            const role = new Role(req.body);
            await role.save();
            req.flash("success", "Thêm quyền thành công");
        }
        catch(err) {
            req.flash("error", "Thêm quyền thất bại");
        }
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    else{
        return;
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    if(res.locals.roles.permission.includes('role_delete')){
        try {
            await Role.updateOne({_id: req.params.id}, {
                deleted: true, 
                deletedBy: {
                    accountId: res.locals.account.id,
                    deleteAt: new Date()
                }
            });
            req.flash("success", "Xóa thành công")
        }
        catch (err){
            req.flash("error", "Xóa thất bại");
        }
        res.redirect('back');
    }
    else{
        return;
    }
}


// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const record = await Role.findOne({_id: req.params.id});

        res.render('./admin/pages/roles/edit.pug', {
            title: "Chỉnh sửa quyền",
            record: record
        })
    }
    catch (err){
        res.status(500).json({ error: 'An unexpected error occurred'});
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('role_edit')){
        try {
            req.body.updatedBy = {
                accountId: res.locals.account.id,
                updateAt: new Date()
            }
    
            await Role.updateOne({_id: req.params.id}, req.body);
            req.flash('success', 'Cập nhật quyền thành công');
            res.redirect(`${systemConfig.prefixAdmin}/roles`);
        }
        catch (err) {
            req.flash('error', 'Cập nhật thất bại');
            res.redirect('back');
        }
    }
    else{
        return;
    }
}

//  [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const record = await Role.findOne({_id: req.params.id});

        res.render('./admin/pages/roles/detail.pug', {
            title: 'Chi tiết quyền',
            record: record
        })
    }
    catch(err) {
        res.redirect('back');
    }
}

// [GET] /admin/roles/permissions
module.exports.permission = async (req, res) => {
    try {
        const records = await Role.find({deleted: false});
        res.render('./admin/pages/roles/permission.pug', {
            title: 'Phân quyền',
            records: records
        })
    }
    catch(err){
        res.status(500).json("Error");
    }

}

// [POST] /admin/roles/permissions
module.exports.permissionPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('role_permission')){

        try {
            const arrData = JSON.parse(req.body.arrObject);
            for(let data of arrData){
                const {id, permission} = data
                await Role.updateOne({_id: id}, {permission: permission});
            }
            req.flash('success', "Cập nhật thành công");
        }
        catch (err) {
            req.flash('error', "Cập nhật thất bại");
        }
        res.redirect('back');
    }
    else{
        return;
    }
}