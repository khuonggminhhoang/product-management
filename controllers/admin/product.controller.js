const Product = require('./../../models/product.model');

// [GET] /admin/products
const index = async (req, res) => {
    const products = await Product.find({
        deleted: false
    });     // truy vấn ra tất cả các sản phẩm trong db
    res.render('./admin/pages/products/index.pug', {title: 'Danh sách sản phẩm', products});
};

module.exports = {index};