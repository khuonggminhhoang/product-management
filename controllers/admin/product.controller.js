const Product = require('./../../models/product.model');
const filterStatusHelper = require('./../../helpers/filterStatus');
const objectSearchHelper = require('./../../helpers/search');

// [GET] /admin/products
const index = async (req, res) => {
    
    // Xử lý các nút lọc
    const filterStatus = filterStatusHelper(req.query);
    // end

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
    // end

    const products = await Product.find(query);     // truy vấn ra tất cả các sản phẩm trong db
    res.render('./admin/pages/products/index.pug', {
        title: 'Danh sách sản phẩm', 
        products: products,
        filterStatus: filterStatus, 
        productName: objectSearch['product-name']
    });

};

module.exports = {index};