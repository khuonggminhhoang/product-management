const Product = require('./../../models/product.model');
const ProductCategory = require('./../../models/product-category.model');
const Article = require('./../../models/article.model');
const ArticleCategory = require('./../../models/article-category.model');
const Account = require('./../../models/account.model');
const User = require('./../../models/user.model');

// [GET] /admin/dashboard
const dashboard = async (req, res) => {
    try{    
        const statistic = {
            productCategory: {
                total: 0,
                active: 0,
                inactive: 0
            },
            product: {
                total: 0,
                active: 0,
                inactive: 0
            },
            articleCategory: {
                total: 0,
                active: 0,
                inactive: 0
            },
            article: {
                total: 0,
                published: 0,
                'pending review': 0,
                rejected: 0,
                draft: 0,
                archived: 0
            },
            account: {
                total: 0,
                active: 0,
                inactive: 0
            },
            user: {
                total: 0,
                active: 0,
                inactive: 0
            }
        }

        statistic.productCategory.total = await ProductCategory.countDocuments({deleted: false});
        statistic.productCategory.active = await ProductCategory.countDocuments({deleted: false, status: 'active'});
        statistic.productCategory.inactive = await ProductCategory.countDocuments({deleted: false, status: 'inactive'});

        statistic.product.total = await Product.countDocuments({deleted: false});
        statistic.product.active = await Product.countDocuments({deleted: false, status: 'active'});
        statistic.product.inactive = await Product.countDocuments({deleted: false, status: 'inactive'});

        statistic.articleCategory.total = await ArticleCategory.countDocuments({deleted: false});
        statistic.articleCategory.active = await ArticleCategory.countDocuments({deleted: false, status: 'active'});
        statistic.articleCategory.inactive = await ArticleCategory.countDocuments({deleted: false, status: 'inactive'});

        statistic.article.total = await Article.countDocuments({deleted: false});
        statistic.article.published = await Article.countDocuments({deleted: false, status: 'published'});
        statistic.article['pending review'] = await Article.countDocuments({deleted: false, status: 'pending review'});
        statistic.article.draft = await Article.countDocuments({deleted: false, status: 'draft'});
        statistic.article.rejected = await Article.countDocuments({deleted: false, status: 'rejected'});
        statistic.article.archived = await Article.countDocuments({deleted: false, status: 'archived'});
        
        statistic.account.total = await Account.countDocuments({deleted: false});
        statistic.account.active = await Account.countDocuments({deleted: false, status: 'active'});
        statistic.account.inactive = await Account.countDocuments({deleted: false, status: 'inactive'});
        
        statistic.user.total = await User.countDocuments({deleted: false});
        statistic.user.active = await User.countDocuments({deleted: false, status: 'active'});
        statistic.user.inactive = await User.countDocuments({deleted: false, status: 'inactive'});




        res.render('./admin/pages/dashboard/index.pug', {
            title: 'Dashboard', 
            statistic: statistic
        });
    }
    catch(err) {
        res.sendStatus(500);
    }


    
    
}

module.exports = {dashboard};