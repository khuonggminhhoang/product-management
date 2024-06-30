const Product = require('./../../models/product.model');

// [GET] /
const index = async (req, res) => {
    try{
        const featuredProducts = await Product.find({
            featured: true,
            status: 'active',
            deleted: false
        }).limit(6); 

        const newProducts = await Product.find({
            status: 'active',
            deleted: false
        }).sort({position: 'desc'}).limit(12);

        res.render('./client/pages/home/index.pug', {
            title: 'Trang chủ',
            featuredProducts: featuredProducts,
            newProducts: newProducts
        });
    }
    catch(err) {
        res.sendStatus();
    }
}

module.exports = {index};