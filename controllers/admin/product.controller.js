const Product = require('./../../models/product.model');
const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const objectPaginationHelper = require('./../../helpers/pagination');

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

    if(objectSearch['product-name']){
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
            limitItems: 3,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )

    const skipProduct = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    // End Pagination



    const products = await Product.find(query)
                        .skip(skipProduct)     // truy vấn ra các sản phẩm trong db
                        .limit(objectPagination.limitItems);

    res.render('./admin/pages/products/index.pug', {
        title: 'Danh sách sản phẩm', 
        products: products,
        filterStatus: filterStatus, 
        productName: objectSearch['product-name'],
        pagination: objectPagination
    });
 
};


// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const id = req.params.id;
    const status = req.params.status;
    await Product.updateOne({_id: id}, {status: status});
    res.redirect('back');                               // chuyển hướng trang lại url trang hiện tại
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const status = req.body.status;
    const ids = req.body.ids;
    const arrId = ids.split("; ");
    await Product.updateMany({_id: {$in: arrId}}, {status: status});
    res.redirect('back');
}
