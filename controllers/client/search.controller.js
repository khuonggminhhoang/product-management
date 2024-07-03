const Product = require('./../../models/product.model');


// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    const regex = new RegExp(keyword, 'i');

    const products = await Product.find({
        title: regex,
        deleted: false,
        status: 'active'
    }).sort({position: 'desc'});

    res.render('./client/pages/search/index.pug', {
        title: `Tìm kiếm - ${keyword}`,
        keyword: keyword,
        products: products
    })
}