const homeRoutes = require('./home.route.js')
const productRoutes = require('./product.route.js')

module.exports = (app) => {
    app.use("/", homeRoutes)
    app.use('/products', productRoutes)
}