const Product = require('./../../models/product.model');
const ProductCategory = require('./../../models/product-category.model');

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

// [GET] /products/detail/:slug
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

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    try{
        const productCategory = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted: false,
            status: 'active'
        });

        // hà lấy ra mảng các category con từ id category cha
        const getSubCategory = async (parentId) => {
            const subs = await ProductCategory.find({
                parentId: parentId,
                status: 'active',
                deleted: false
            });

            let arr = [...subs];

            for(let sub of subs){
                const childs = await getSubCategory(sub.id); 
                arr = [...arr, ...childs]
            }
            return arr;
        }

        const arrSubCategory = await getSubCategory(productCategory.id);
        let arrId = [productCategory.id, ...arrSubCategory.map(item => item.id)];
        
        const products = await Product.find({
            productCategoryId: {$in: arrId},
            status: 'active',
            deleted: false
        })
         

        res.render('./client/pages/products/index.pug', {
            title: productCategory.title, 
            products: products
        });

    }
    catch(err){
        res.redirect('back');
    }
}