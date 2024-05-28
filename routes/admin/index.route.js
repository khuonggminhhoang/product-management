const dashBoardRoutes = require('./dashboard.route');
const {prefixAdmin} = require('./../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashBoardRoutes);
}