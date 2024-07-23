const homeRoutes = require('./home.route.js');
const productRoutes = require('./product.route.js');
const articleRoutes = require('./article.route.js');
const searchRoutes = require('./search.route.js');
const cartRoutes = require('./cart.route.js');
const checkoutRoutes = require('./checkout.route.js');
const userRoutes = require('./user.route.js');
const chatRoutes = require('./chat.route.js');

const middlewareSubmenu = require('./../../middlewares/client/sub-menu.middleware.js');
const middlewareCart = require('./../../middlewares/client/cart.middleware.js');
const middlewareUser = require('./../../middlewares/client/user.middleware.js');
const middlewareAuth = require('./../../middlewares/client/auth.middleware.js');
const middlewareSettingGeneral = require('./../../middlewares/client/setting-general.middleware.js');

module.exports = (app) => {
    app.use(middlewareSubmenu.productCategory);
    app.use(middlewareSubmenu.articleCategory);
    app.use(middlewareCart.cartId);
    app.use(middlewareUser.infoUser);
    app.use(middlewareSettingGeneral.settingGeneral);

    console.log('client running...');

    app.use("/", homeRoutes);
    app.use('/products', productRoutes);
    app.use('/articles', articleRoutes);
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', middlewareAuth.requireAuth, checkoutRoutes);
    app.use('/user', userRoutes);
    app.use('/chat', middlewareAuth.requireAuth, chatRoutes);
}