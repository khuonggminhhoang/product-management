module.exports.articleValid = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', 'Tiêu đề trống!');
        res.redirect('back');
        return;
    }

    next();
}                                                           // middleware