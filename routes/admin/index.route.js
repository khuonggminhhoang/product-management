const dashBoardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const trashRoutes = require('./trash.route');
const productCategoryRoutes = require('./product-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');

const systemConfig = require('./../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashBoardRoutes);
    app.use(PATH_ADMIN + '/products', productRoutes); 
    app.use(PATH_ADMIN + '/trash', trashRoutes)
    app.use(PATH_ADMIN + '/products-category', productCategoryRoutes);
    app.use(PATH_ADMIN + '/roles', roleRoutes);
    app.use(PATH_ADMIN + '/accounts', accountRoutes);
}