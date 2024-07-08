module.exports.orderValid = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng điền họ tên');
        res.redirect('back');
        return;
    }

    if (!req.body.address) {
        req.flash('error', 'Vui lòng điền địa chỉ');
        res.redirect('back');
        return;
    }

    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại');
        res.redirect('back');
        return;
    }
    else {
        const regex = /^(0|\+84)\d{3}[ ]?\d{3}[ ]?\d{3}$/;
        if (!regex.test(req.body.phone)) {
            req.flash('error', 'Vui lòng nhập đúng số điện thoại');
            res.redirect('back');
            return;
        }
    }

    next();
}