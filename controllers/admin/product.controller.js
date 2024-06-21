const Product = require('./../../models/product.model');
const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const objectPaginationHelper = require('./../../helpers/pagination');
const systemConfig = require('./../../config/system');

// [GET] /admin/products
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
    const totalProduct = await Product.countDocuments(query);       // đếm số sản phẩm trong db dựa vào query
    const objectPagination = objectPaginationHelper(
        req.query, 
        totalProduct, 
        {
            currentPage: 1,
            limitItems: 5,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )

    const skipProduct = (objectPagination.currentPage - 1) * objectPagination.limitItems;
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

    const products = await Product.find(query)
                        .sort(sort)
                        .skip(skipProduct)     // truy vấn ra các sản phẩm trong db
                        .limit(objectPagination.limitItems);

    res.render('./admin/pages/products/index.pug', {
        title: 'Danh sách sản phẩm', 
        products: products,
        filterStatus: filterStatus, 
        productName: objectSearch.target,
        pagination: objectPagination
    });
 
};


// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    try{
        await Product.updateOne({_id: id}, {status: status});
        req.flash("success", "Cập nhật trạng thái thành công");
    }
    catch(e) {
        req.flash("error", "Cập nhật trạng thái thất bại");
    }

    res.redirect('back');                               // chuyển hướng trang lại url trang hiện tại
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids;
    const arrId = ids.split("; ");

    switch(type){
        case 'active': 
            try{
                await Product.updateMany({_id: {$in: arrId}}, {status: 'active'});
                req.flash("success", "Cập nhật trạng thái thành công")
            }
            catch(e) {
                req.flash("error", "Cập nhật trạng thái thất bại");
            }
            break;

        case 'inactive':
            try{
                await Product.updateMany({_id: {$in: arrId}}, {status: 'inactive'});
                req.flash("success", "Cập nhật trạng thái thành công")
            }
            catch(e) {
                req.flash("error", "Cập nhật trạng thái thất bại");
            }
            break;

        case 'delete-all':
            try{
                await Product.updateMany({_id: {$in: arrId}}, {deleted: true, deleteAt: new Date()});
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
                    await Product.updateOne({_id: id}, {position: position});
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

// [DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
    try{
        const id = req.params.id;
        await Product.updateOne({_id: id}, {
            deleted: true,
            deleteAt: new Date()
        });
        req.flash("success", "Xóa sản phẩm thành công")
    }
    catch(e) {
        req.flash("error", "Xóa sản phẩm thất bại");
    }
    res.redirect('back');
};

// [GET] /admin/products/create
module.exports.create = (req, res) => {
    res.render('./admin/pages/products/create.pug', {title: "Thêm mới sản phẩm"});
}
    
// [POST] /admin/products/create
module.exports.createPOST = async (req, res) => {
    const qtyProduct = await Product.countDocuments();
    const dataProduct = req.body;
    dataProduct.price = dataProduct.price == '' ? 0 : parseInt(dataProduct.price);
    dataProduct.discountPercentage = dataProduct.discountPercentage == '' ? 0 : parseFloat(dataProduct.discountPercentage);
    dataProduct.stock = dataProduct.stock == '' ? 0 : parseFloat(dataProduct.stock);
    dataProduct.position = dataProduct.position == '' ? qtyProduct + 1 : parseInt(dataProduct.position);
    
    //=====================
    // console.log(req.file);          // req.file của thư viện multer
    //=====================
    try{
        const product = new Product(dataProduct);
        await product.save();
        req.flash("success", "Tạo mới sản phẩm thành công");
    }
    catch(e) {
        req.flash("error", "Tạo mới sản phẩm thất bại");
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const product = await Product.findOne({
            deleted: false,
            _id: req.params.id
        });
        
        
        res.render('./admin/pages/products/edit.pug', {
            title: "Chỉnh sửa sản phẩm",
            product: product
        });
    }
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editProduct = async (req, res) => {
    const id = req.params.id;
    const dataProduct = req.body;
    const qtyProduct = await Product.countDocuments();

    dataProduct.price = dataProduct.price == '' ? 0 : parseInt(dataProduct.price);
    dataProduct.discountPercentage = dataProduct.discountPercentage == '' ? 0 : parseFloat(dataProduct.discountPercentage);
    dataProduct.stock = dataProduct.stock == '' ? 0 : parseFloat(dataProduct.stock);
    dataProduct.position = dataProduct.position == '' ? qtyProduct : parseInt(dataProduct.position);
    
    try{
        await Product.updateOne({_id: id}, dataProduct);
        req.flash("success", "Cập nhật sản phẩm thành công");
    }
    catch(err) {
        req.flash("error", "Cập nhật sản phẩm không thành công");
    }

    res.redirect('back');
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const product = await Product.findOne({
            deleted: false,
            _id: req.params.id
        });
        
        
        res.render('./admin/pages/products/detail.pug', {
            title: product.title,
            product: product
        });
    }
    catch(err){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}