const Product = require('./../../models/product.model');

// [GET] /
const index = async (req, res) => {
    try{
        const featuredProducts = await Product.find({
            featured: true,
            status: 'active',
            deleted: false
        }).limit(10); 

        res.render('./client/pages/home/index.pug', {
            title: 'Trang chủ',
            featuredProducts: featuredProducts
        });
    }
    catch(err) {
        res.sendStatus();
    }
}

module.exports = {index};