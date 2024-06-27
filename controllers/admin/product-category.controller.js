const ProductCategory = require('./../../models/product-category.model');
const Account = require('./../../models/account.model');

const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const systemConfig = require('./../../config/system');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');

const createTreeHelper = require('./../../helpers/createTree');

// [GET] /admin/products-category
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


    const arr = await ProductCategory.find(query)
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

    res.render('./admin/pages/product-category/index.pug', {
        title: 'Danh mục sản phẩm', 
        records: records,
        filterStatus: filterStatus, 
        productName: objectSearch.target,
        cnt: 1 // biến đếm để tăng số thứ tự
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let parentsCategory = [];
    try {
        const arr = await ProductCategory.find({deleted: false, status: 'active'});

        parentsCategory = createTreeHelper(arr, "");  // vì trong database lưu danh mục top đầu có parentId là xâu "" 
    }
    catch(err) {
        req.flash('error', '[Danh mục cha] Lỗi data');
    }

    res.render('./admin/pages/product-category/create.pug', {
        title: "Thêm mới danh mục", 
        parentsCategory: parentsCategory
    });
}

// [POST] /admin/products-category/create
module.exports.createPOST = async (req, res) => {
    const qtyProduct = await ProductCategory.countDocuments();
    req.body.position = req.body.position == '' ? qtyProduct + 1 : parseInt(req.body.position);
    req.body.parentId = req.body.parentId; 
    //=====================
    // console.log(req.file);          // req.file của thư viện multer
    //=====================

    req.body.createdBy = {
        accountId: res.locals.account.id
    }

    try{
        const record = new ProductCategory(req.body);
        await record.save();
        req.flash("success", "Tạo mới danh mục thành công");
    }
    catch(e) {
        req.flash("error", "Tạo mới danh mục thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        await ProductCategory.updateOne({_id: id}, {
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

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const id = req.params.id;
        const productCategory =await ProductCategory.findOne({
            deleted: false,
            _id: id
        });

        res.render('./admin/pages/product-category/detail.pug', {
            title: 'Chi tiết danh mục',
            productCategory: productCategory
        })
    }
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const arr = await ProductCategory.find({deleted: false, status: 'active'});
        const parentsCategory = createTreeHelper(arr, '');

        const productCategory = await ProductCategory.findOne({_id: req.params.id,deleted: false});

        
        res.render('./admin/pages/product-category/edit.pug', {
            title: "Chỉnh sửa danh mục",
            productCategory: productCategory,
            parentsCategory : parentsCategory
        })
    }   
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPOST = async (req, res) => {
    const id = req.params.id;
    const qty = await ProductCategory.countDocuments();
    req.body.position = req.body.position == '' ? qty : parseInt(req.body.position);

    req.body.updatedBy = {
        accountId: res.locals.account.id,
        updateAt: new Date()    
    }
    try{
        await ProductCategory.updateOne({_id: id}, req.body);
        req.flash("success", "Cập nhật danh mục thành công");
    }
    catch(err) {
        req.flash("error", "Cập nhật danh mục thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products-category/detail/${req.params.id}`);
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    try{
        const id = req.params.id;
        await ProductCategory.updateOne({_id: id}, {
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

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids;
    const arrId = ids.split("; ");

    switch(type){
        case 'active': 
            try{
                await ProductCategory.updateMany({_id: {$in: arrId}}, {
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
                await ProductCategory.updateMany({_id: {$in: arrId}}, {
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
                await ProductCategory.updateMany({_id: {$in: arrId}}, {
                    deleted: true,
                    deletedBy: {
                        accountId: res.locals.account.id,
                        deleteAt: new Date()
                    }
                });
                req.flash("success", "Xóa sản phẩm thành công")
            }
            catch(e) {
                req.flash("error", "Xóa sản phẩm thất bại");
            }
            break;

        case 'change-position':
            try{
                for(let item of arrId) {
                    let [id, position] = item.split('-');
                    position = parseInt(position);
                    await ProductCategory.updateOne({_id: id}, {
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
};