const ProductCategory = require('./../../models/product-category.model');
const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const objectPaginationHelper = require('./../../helpers/pagination');
const systemConfig = require('./../../config/system');
const { response } = require('express');

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

    // Pagination
    const totalProduct = await ProductCategory.countDocuments(query);       // đếm số sản phẩm trong db dựa vào query
    const objectPagination = objectPaginationHelper(
        req.query, 
        totalProduct, 
        {
            currentPage: 1,
            limitItems: 5,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )

    const skipRecords = (objectPagination.currentPage - 1) * objectPagination.limitItems;
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

    const records = await ProductCategory.find(query)
                        .sort(sort)
                        .skip(skipRecords)     // truy vấn ra các sản phẩm trong db
                        .limit(objectPagination.limitItems);
    
    res.render('./admin/pages/product-category/index.pug', {
        title: 'Danh mục sản phẩm', 
        records: records,
        filterStatus: filterStatus, 
        productName: objectSearch.target,
        pagination: objectPagination
    });
}

// [GET] /admin/products-category/create
module.exports.create = (req, res) => {
    res.render('./admin/pages/product-category/create.pug', {title: "Thêm mới danh mục"});
}

// [POST] /admin/products-category/create
module.exports.createPOST = async (req, res) => {
    const qtyProduct = await ProductCategory.countDocuments();
    req.body.position = req.body.position == '' ? qtyProduct + 1 : parseInt(req.body.position);
    req.body.parentId = req.body.parentId; 
    //=====================
    // console.log(req.file);          // req.file của thư viện multer
    //=====================
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
        await ProductCategory.updateOne({_id: id}, {status: status});
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
        const productCategory = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id 
        })

        res.render('./admin/pages/product-category/edit.pug', {
            title: "Chỉnh sửa danh mục",
            productCategory: productCategory
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
    try{
        await ProductCategory.updateOne({_id: id}, req.body);
        req.flash("success", "Cập nhật danh mục thành công");
    }
    catch(err) {
        req.flash("error", "Cập nhật danh mục thất bại");
    }
    res.redirect('back');
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    try{
        const id = req.params.id;
        await ProductCategory.updateOne({_id: id}, {
            deleted: true,
            deleteAt: new Date()
        })
        req.flash("success", "Xóa danh mục thành công")
    }
    catch(err) {
        req.flash("error", "Xóa danh mục thất bại");
    }
    res.redirect('back');
}