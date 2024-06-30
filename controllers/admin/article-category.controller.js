const ArticleCategory = require('./../../models/article-category.model');
const Account = require('./../../models/account.model');

const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');
const createTreeHelper = require('./../../helpers/createTree');

const systemConfig = require('./../../config/system');


// [GET] /admin/articles-category
module.exports.index = async (req, res) => {
    // Xử lý các nút lọc
    const filterStatus = filterStatusHelper(req.query);
    // End

    const query = {
        deleted: false
    }

    if(req.query.status){
        query.status = req.query.status;
    }

    // Xử lý tìm kiếm sản phẩm
    const objectSearch = objectSearchHelper(req.query);

    if(objectSearch.target){
        query.title = objectSearch.regex;
    }
    // End

    // Sort
    const sort = {};
    if(req.query.sortBy && req.query.order){
        sort[req.query.sortBy] = req.query.order;
    }
    else{
        sort.position = 'desc';
    }
    // End Sort


    const arr = await ArticleCategory.find(query)
                        .sort(sort)

    for(let item of arr){
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

    const records = createTreeHelper(arr, '');

    res.render('./admin/pages/article-category/index.pug', {
        title: 'Danh mục sản phẩm', 
        records: records,
        filterStatus: filterStatus, 
        productName: objectSearch.target,
        cnt: 1 // biến đếm để tăng số thứ tự
    });
}

// [GET] /admin/articles-category/create
module.exports.create = async (req, res) => {
    let parentsCategory = [];
    try {
        const arr = await ArticleCategory.find({deleted: false, status: 'active'});

        parentsCategory = createTreeHelper(arr, "");  // vì trong database lưu danh mục top đầu có parentId là xâu "" 
    }
    catch(err) {
        req.flash('error', '[Danh mục cha] Lỗi data');
    }

    res.render('./admin/pages/article-category/create.pug', {
        title: "Thêm mới danh mục", 
        parentsCategory: parentsCategory
    });
}

// [POST] /admin/articles-category/create
module.exports.createPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('article-category_create')){
        const qty = await ArticleCategory.countDocuments();
        req.body.position = req.body.position == '' ? qty + 1 : parseInt(req.body.position);
    
        req.body.createdBy = {
            accountId: res.locals.account.id
        }
    
        try{
            const record = new ArticleCategory(req.body);
            await record.save();
            req.flash("success", "Tạo mới danh mục thành công");
        }
        catch(e) {
            req.flash("error", "Tạo mới danh mục thất bại");
        }
        res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
    }
    else{
        return;
    }
}

// [PATCH] /admin/articles-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => { 
    if(res.locals.roles.permission.includes('article-category_edit')){
        try {
            const status = req.params.status;
            const id = req.params.id;
            await ArticleCategory.updateOne({_id: id}, {
                status: status,
                updatedBy: {
                    accountId: res.locals.account.id,
                    updateAt: new Date()    
                }
            });
            req.flash('success', 'Thay đổi trạng thái thành công');
        }
        catch(err){
            req.flash('error', 'Thay đổi trạng thái thất bại');
        }
        res.redirect('back');
    }
    else{
        return;
    }
}

// [GET] /admin/articles-category/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const id = req.params.id;
        const articleCategory =await ArticleCategory.findOne({
            deleted: false,
            _id: id
        });
        res.render('./admin/pages/article-category/detail.pug', {
            title: 'Chi tiết danh mục bài viết',
            articleCategory: articleCategory
        })
    }
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
    }
}

// [GET] /admin/articles-category/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const arr = await ArticleCategory.find({deleted: false, status: 'active'});
        const parentsCategory = createTreeHelper(arr, '');

        const articleCategory = await ArticleCategory.findOne({_id: req.params.id,deleted: false});

        res.render('./admin/pages/article-category/edit.pug', {
            title: "Chỉnh sửa danh mục bài viết",
            articleCategory: articleCategory,
            parentsCategory : parentsCategory
        })
    }   
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/articles-category/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('article-category_edit')){
        const id = req.params.id;
        const qty = await ArticleCategory.countDocuments();
        req.body.position = req.body.position == '' ? qty : parseInt(req.body.position);
    
        req.body.updatedBy = {
            accountId: res.locals.account.id,
            updateAt: new Date()    
        }
        try{
            await ArticleCategory.updateOne({_id: id}, req.body);
            req.flash("success", "Cập nhật danh mục thành công");
        }
        catch(err) {
            req.flash("error", "Cập nhật danh mục thất bại");
        }
        res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
    }
    else{
        return;
    }
}

// [DELETE] /admin/articles-category/delete/:id
module.exports.delete = async (req, res) => {
    if(res.locals.roles.permission.includes('article-category_delete')){

        try{
            const id = req.params.id;
            await ArticleCategory.updateOne({_id: id}, {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.account.id,
                    deleteAt: new Date()
                }
            })
            req.flash("success", "Xóa danh mục thành công")
        }
        catch(err) {
            req.flash("error", "Xóa danh mục thất bại");
        }
        res.redirect('back');
    }
    else{
        return;
    }
}

// [PATCH] /admin/articles-category/change-multi
module.exports.changeMulti = async (req, res) => {
    if(res.locals.roles.permission.includes('article-category_edit')){

        const type = req.body.type;
        const ids = req.body.ids;
        const arrId = ids.split("; ");
    
        switch(type){
            case 'active': 
                try{
                    await ArticleCategory.updateMany({_id: {$in: arrId}}, {
                        status: 'active',
                        updatedBy: {
                            accountId: res.locals.account.id,
                            updateAt: new Date()    
                        }
                    });
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'inactive':
                try{
                    await ArticleCategory.updateMany({_id: {$in: arrId}}, {
                        status: 'inactive',
                        updatedBy: {
                            accountId: res.locals.account.id,
                            updateAt: new Date()    
                        }
                    });
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'delete-all':
                try{
                    await ArticleCategory.updateMany({_id: {$in: arrId}}, {
                        deleted: true,
                        deletedBy: {
                            accountId: res.locals.account.id,
                            deleteAt: new Date()
                        }
                    });
                    req.flash("success", "Xóa danh mục thành công")
                }
                catch(e) {
                    req.flash("error", "Xóa danh mục thất bại");
                }
                break;
    
            case 'change-position':
                try{
                    for(let item of arrId) {
                        let [id, position] = item.split('-');
                        position = parseInt(position);
                        await ArticleCategory.updateOne({_id: id}, {
                            position: position,
                            updatedBy: {
                                accountId: res.locals.account.id,
                                updateAt: new Date()    
                            }
                        });
                    }
                    req.flash("success", "Thay đổi vị trí thành công")
                }
                catch(e) {
                    req.flash("error", "Thay đổi vị trí thất bại");
                }
                break;
    
            default:
                break;
        }
    
        res.redirect('back');
    }
    else{
        return;
    }
};