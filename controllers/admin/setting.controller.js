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