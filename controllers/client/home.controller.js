const Product = require('./../../models/product.model');

// [GET] /
const index = async (req, res) => {
    try{
        // lấy ra mảng các sp các sp nổi bật
        const featuredProducts = await Product.find({
            featured: true,
            status: 'active',
            deleted: false
        }).limit(12); 

        // lấy ra mảng các sp mới
        const newProducts = await Product.find({
            status: 'active',
            deleted: false
        }).sort({position: 'desc'}).limit(24);

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