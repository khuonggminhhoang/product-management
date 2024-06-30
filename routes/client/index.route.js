const homeRoutes = require('./home.route.js');
const productRoutes = require('./product.route.js');

const middleware = require('./../../middlewares/client/product-category.middleware.js')

module.exports = (app) => {
    app.use(middleware.productCategory);

    app.use("/", homeRoutes);
    app.use('/products', productRoutes);
}