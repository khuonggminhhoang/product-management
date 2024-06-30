const ProductCategory = require('./../../models/product-category.model');
const ArticleCategory = require('./../../models/article-category.model');

const createTree = require('./../../helpers/createTree');

module.exports.productCategory = async (req, res, next) => {
    const arr = await ProductCategory.find({status: 'active', deleted: false});
    res.locals.layoutProductCategory = createTree(arr, '');
    
    next();
}

module.exports.articleCategory = async (req, res, next) => {
    const arr = await ArticleCategory.find({status: 'active', deleted: false});
    res.locals.layoutArticleCategory = createTree(arr, '');

    next();
}