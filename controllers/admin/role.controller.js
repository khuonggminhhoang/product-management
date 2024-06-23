const Role = require('./../../models/role.model');
const systemConfig = require('./../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        const records = await Role.find({
            deleted: false 
        })

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
    try{
        const role = new Role(req.body);
        await role.save();
        req.flash("success", "Thêm quyền thành công");
    }
    catch(err) {
        req.flash("error", "Thêm quyền thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        await Role.deleteOne({_id: req.params.id});
        req.flash("success", "Xóa thành công")
    }
    catch (err){
        req.flash("error", "Xóa thất bại");
    }
    res.redirect('back');
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
    try {
        await Role.updateOne({_id: req.params.id}, req.body);
        req.flash('success', 'Cập nhật quyền thành công');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    catch (err) {
        req.flash('error', 'Cập nhật thất bại');
        res.redirect('back');
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