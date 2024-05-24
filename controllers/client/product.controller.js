const Product = require('./../../models/product.model');

const index = async (req, res)=> {
    const products = await Product.find({
        status: 'active',
        deleted: false
    });
    console.log(products);
    res.render('./client/pages/products/index.pug', {title: 'Products', products})
}

module.exports = {index}