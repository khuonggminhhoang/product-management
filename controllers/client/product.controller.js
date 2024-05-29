const Product = require('./../../models/product.model');

// [GET] /products
const index = async (req, res)=> {
    const products = await Product.find({
        status: 'active',
        deleted: false
    });
    res.render('./client/pages/products/index.pug', {title: 'Danh sách sản phẩm', products});
}

module.exports = {index};