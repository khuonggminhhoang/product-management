const SettingGeneral = require('./../../models/setting-general.model');

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
    
    res.render('./admin/pages/setting/general.pug', {
        title: 'Cài đặt chung',
        settingGeneral: settingGeneral
    })
}

// [PATCH] /admin/setting/general
module.exports.generalPATCH = async (req, res) => {
    const data = JSON.parse(req.body['info-generral']);
    delete req.body['info-generral'];

    req.body = {...req.body, ...data.objectMainInfo};
    req.body.socialLink = data.objectSocialLink;
    req.body.eCommerceLink = data.objectEcommerceLink;
    
    const settingGeneral = await SettingGeneral.findOne({});
    if(settingGeneral) {
        await SettingGeneral.updateOne({_id: settingGeneral.id}, req.body);
    }
    else {
        const object = new SettingGeneral(req.body);
        await object.save();
    }

    req.flash('success', 'Cập nhật thành công');
    res.redirect('back');
}

// [POST] /admin/setting/branch/add
module.exports.addBranch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        if(!settingGeneral) {
            req.flash('error', 'Cần lưu các thông tin chính trước');
            res.redirect('back');
            return;
        }

        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        },{
            $push: {
                branch: req.body
            }
        })

        req.flash('success', 'Thêm cơ sở thành công');
        res.redirect('back');
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /admin/setting/branch/delete
module.exports.deleteBranch = async (req, res) => {
    try {
        const settingGeneral = await SettingGeneral.findOne({});
        if(!settingGeneral) {
            req.flash('error', 'Cần lưu các thông tin chính trước');
            res.redirect('back');
            return;
        }

        if(!req.query.branchName) {
            req.flash('error', 'Nhập tên cơ sở để xóa');
            res.redirect('back');
            return;
        } 

        let flag = false;
        for(let item of settingGeneral.branch) {
            if(item.branchName == req.query.branchName) {
                flag = true;
                break;
            }
        }
        if(flag) {
            await SettingGeneral.updateOne({
                _id: settingGeneral.id  
            }, {
                $pull: {
                    branch: {branchName: req.query.branchName}
                }
            })
            req.flash('success', 'Xóa cơ sở thành công');
        }
        else {
            req.flash('error', 'Tên cơ sở không tồn tại');
        }
    
        res.redirect('back');
    }
    catch(err) {
        res.sendStatus(500);
    }
}