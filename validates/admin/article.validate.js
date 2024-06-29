module.exports.articleValid = (req, res, next) => {
    if(!req.body.title){
        req.flash('error', 'Tiêu đề trống!');
        res.redirect('back');
        return;
    }

    if(!req.body.articleCategoryId){
        req.flash('error', 'Vui lòng chọn danh mục bài viết');
        res.redirect('back');
        return;
    }

    next();
}                                                           // middleware