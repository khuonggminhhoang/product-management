const Product = require('./../../models/product.model');
const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');
const objectPaginationHelper = require('./../../helpers/pagination');

// [GET] /admin/products
const index = async (req, res) => {
    
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

module.exports = {index};