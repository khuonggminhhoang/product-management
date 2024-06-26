const dashBoardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const trashRoutes = require('./trash.route');
const productCategoryRoutes = require('./product-category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');

const systemConfig = require('./../../config/system');
const middleware = require('./../../middlewares/admin/auth.middleware');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN, adminRoutes);
    app.use(PATH_ADMIN + '/dashboard', middleware.requireAuth, dashBoardRoutes);
    app.use(PATH_ADMIN + '/products',middleware.requireAuth, productRoutes); 
    app.use(PATH_ADMIN + '/trash',middleware.requireAuth, trashRoutes)
    app.use(PATH_ADMIN + '/products-category',middleware.requireAuth, productCategoryRoutes);
    app.use(PATH_ADMIN + '/roles',middleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + '/accounts',middleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + '/auth', authRoutes);
}