const ArticleCategory = require('./../../models/article-category.model');
const Article = require('./../../models/article.model');
const Account = require('./../../models/account.model');

const createTreeHelper = require('./../../helpers/createTree');
const objectPaginationHelper = require('./../../helpers/pagination');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');
const objectSearchHelper = require('./../../helpers/search');

const systemConfig = require('./../../config/system');

// [GET] admin/articles
module.exports.index = async (req, res) => {
    // Xử lý các nút lọc
    const filterStatus = [
        {
            name: 'Tất cả',
            class: 'active',  // cặp key-value này chỉ có tác dụng bôi xanh nút click vì thêm class active của Bootstrap 4 vào element
            status: ''
        },
        {
            name: 'Đã xuất bản',
            class: '',
            status: 'published'
        },
        {
            name: 'Bản nháp',
            class: '',
            status: 'draft'
        },
        {
            name: 'Chờ duyệt',
            class: '',
            status: 'pending review'
        },
        {
            name: 'Lưu trữ',
            class: '',
            status: 'archived'
        },
        {
            name: 'Từ chối',
            class: '',
            status: 'rejected'
        }
    ]
    
    if(req.query.status){
        // cập nhật trạng thái button khi click
        for(let item of filterStatus){
            item.class = item.status == req.query.status ? 'active' : '';
        }
    }
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

    // Pagination
    const totalArticle = await Article.countDocuments(query);       // đếm số article trong db dựa vào query
    const objectPagination = objectPaginationHelper(
        req.query, 
        totalArticle, 
        {
            currentPage: 1,
            limitItems: 10,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )

    const skipArticle = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    // End Pagination

    // Sort
    const sort = {};
    if(req.query.sortBy && req.query.order){
        sort[req.query.sortBy] = req.query.order;
    }
    else{
        sort.position = 'desc';
    }
    
    // End Sort

    const records = await Article.find(query)
                        .sort(sort)
                        .skip(skipArticle)     
                        .limit(objectPagination.limitItems);

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

    res.render('./admin/pages/articles/index.pug', {
        title: 'Danh mục bài viết',
        records: records, 
        filterStatus: filterStatus,
        keyword: objectSearch.target,
        pagination: objectPagination
    })
}

// [GET] admin/articles/create
module.exports.create = async (req, res) => {
    let category = [];
    try {
        const arr = await ArticleCategory.find({deleted: false, status: 'active'});
        category = createTreeHelper(arr, '');
    }
    catch (err) {
        req.flash('error', '[Danh mục cha] Lỗi data');
    }

    res.render('./admin/pages/articles/create', {
        title: 'Thêm bài viết',
        category: category
    });
}

// [POST] admin/articles/create
module.exports.createPOST = async (req, res) => {
    if(res.locals.roles.permission.includes('article_create')){

        try {
            const qty = await Article.countDocuments();
            req.body.position = req.body.position == '' ? qty + 1 : parseInt(req.body.position); 
            req.body.createdBy = {
                accountId: res.locals.account.id, 
                createAt: new Date()
            }
            const article = new Article(req.body);
            await article.save();
            req.flash('success', 'Tạo bài viết thành công');
        }
        catch(err) {    
            req.flash('error', 'Tạo bài viết thất bại');
        }
        
        res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
    else{
        return;
    }
}

// [PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.roles.permission.includes('article_edit')){

        const id = req.params.id;
        const status = req.params.status;
        try{
            await Article.updateOne({_id: id}, {
                status: status,
                updatedBy: {
                    accountId: res.locals.account.id,
                    updateAt: new Date()
                }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
        }
        catch(e) {
            req.flash("error", "Cập nhật trạng thái thất bại");
        }
    
        res.redirect('back');                               // chuyển hướng trang lại url trang hiện tại
    }
    else{
        return;
    }
};

// [PATCH] /admin/articles/change-multi
module.exports.changeMulti = async (req, res) => {
    if(res.locals.roles.permission.includes('article_edit')){

        const type = req.body.type;
        const ids = req.body.ids;
        const arrId = ids.split("; ");
        const updatedBy = {
            accountId: res.locals.account.id,
            updateAt: new Date()
        }
        switch(type){
            case 'rejected':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {status: 'rejected', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'pending review':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {status: 'pending review', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'archived':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {status: 'archived', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'published':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {status: 'published', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'draft':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {status: 'draft', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'delete-all':
                try{
                    await Article.updateMany({_id: {$in: arrId}}, {
                        deleted: true,  
                        deletedBy: {
                            accountId: res.locals.account.id,
                            deleteAt: new Date()
                        },
                        updatedBy: updatedBy
                    });
                    
                    req.flash("success", "Xóa bài viết thành công")
                }
                catch(e) {
                    req.flash("error", "Xóa bài viết thất bại");
                }
                break;
    
            case 'change-position':
                try{
                    for(let item of arrId) {
                        let [id, position] = item.split('-');
                        position = parseInt(position);
                        await Article.updateOne({_id: id}, {position: position, updatedBy: updatedBy});
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

// [DELETE]/admin/articles/delete/:id
module.exports.delete = async (req, res) => {
    if(res.locals.roles.permission.includes('article_delete')){
        try {
            const id = req.params.id;
            await Article.updateOne({_id: id}, {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.account.id,
                    deleteAt: new Date()
                }
            })
    
            req.flash('success', 'Xóa bài viết thành công');
        }
        catch(err){
            req.flash('error', 'Xóa bài viết thất bại');
        }
        res.redirect('back');
    }
    else{
        return;
    }
}

// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const arr = await ArticleCategory.find({deleted: false, status: 'active'});
        const category = createTreeHelper(arr, '');

        const article = await Article.findOne({
            _id: req.params.id,
            deleted: false
        })

        res.render('./admin/pages/articles/edit.pug', {
            title: 'Chỉnh sửa bài viết' ,
            article: article,
            category: category
        })
    }
    catch (err){
        res.status(404).json('NOT FOUND');
    }
}

// [PATCH] /admin/article/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('article_edit')){
        try{
            const qty = await Article.countDocuments();
            req.body.position = req.body.position == '' ? qty : parseInt(req.body.position); 
    
            req.body.updatedBy = {
                accountId: res.locals.account.id,
                updateAt: new Date()
            }
    
            await Article.updateOne({_id: req.params.id}, req.body)
            req.flash('success', 'Cập nhật bài viết thành công');
        }
        catch(err) {
            req.flash('error', 'Cập nhật bài viết thất bại');
        }
        res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
    else{
        return;
    }
}

// [GET] /admin/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const article = await Article.findOne({_id: req.params.id, deleted: false});

        const userCreate = await Account.findOne({_id: article.createdBy.accountId, deleted: false, status: 'active'})
        if(userCreate){
            article.accountFullNameCreate = userCreate.fullName;
            article.createAt = dateTimeFormatterHelper.formatDateTime(article.createdBy.createAt);
        
        }
        const userUpdate = await Account.findOne({_id: article.updatedBy.accountId, deleted: false, status: 'active'})
        if(userUpdate){
            article.accountFullNameUpdate = userUpdate.fullName;
            article.updateAt = dateTimeFormatterHelper.formatDateTime(article.updatedBy.updateAt);
        }

        res.render('./admin/pages/articles/detail.pug', {
            title: article.title,
            article: article
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}

