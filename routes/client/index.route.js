const homeRoutes = require('./home.route.js');
const productRoutes = require('./product.route.js');
const articleRoutes = require('./article.route.js');
const searchRoutes = require('./search.router.js');

const middleware = require('./../../middlewares/client/sub-menu.middleware.js')

module.exports = (app) => {
    app.use(middleware.productCategory);
    app.use(middleware.articleCategory);

    app.use("/", homeRoutes);
    app.use('/products', productRoutes);
    app.use('/articles', articleRoutes);
    app.use('/search', searchRoutes);
}