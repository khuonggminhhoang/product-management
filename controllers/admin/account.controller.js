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
            record.role = role.title;
        }

        res.render('./admin/pages/accounts/index.pug', {
            title: 'Tài khoản',
            records: records
        });
    }
    catch(err){
        res.status(404).json('Not Found');
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