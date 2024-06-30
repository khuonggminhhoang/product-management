const Product = require('./../../models/product.model');

// [GET] /products
module.exports.index = async (req, res)=> {
    const products = await Product.find({
        status: 'active',
        deleted: false
    }).sort({position: 'desc'});
    
    res.render('./client/pages/products/index.pug', {
        title: 'Danh sách sản phẩm', 
        products: products
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    try {
        const product = await Product.findOne({
            deleted: false,
            slug: slug
        });

        res.render('./client/pages/products/detail.pug', {
            title: product.title,
            product: product
        })
    }
    catch(err){
        res.redirect('back');
    }
}