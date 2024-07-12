const Product = require('./../../models/product.model');
const Cart = require('./../../models/cart.model');
const Order = require('./../../models/order.model');

// [GET] /checkout
module.exports.index = async (req, res) => {
    try{
        const cartId = req.cookies.cartId;
        const cart = await Cart.findOne({_id: cartId});
        if(!cart){
            throw new Error('Lỗi');
        }
        
        const products = [];        // sử dụng for of nếu bên trong vòng lặp là hàm async await
        for(let item of cart.products) {
            const productId = item.productId;
            const quantity = item.quantity;
            const product = await Product.findOne({_id: productId});
            const price = product.price;                                // Number
            const discountPercentage = product.discountPercentage;      // Number
            const unitPrice = parseInt(price * ((100 - product.discountPercentage)/100))

            const objectProduct = {
                productId: productId,
                price: price,
                discountPercentage: discountPercentage,
                quantity: quantity,
                product: product,
                totalPrice: unitPrice * quantity 
            }
            products.push(objectProduct);
        };
        const totalPrice = products.reduce((total, item) => total + item.totalPrice, 0);
        
        res.render('./client/pages/checkout/index.pug', {
            title: 'Thanh toán',
            products: products,
            totalPrice: totalPrice
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).send('lỗi' + err.message)
    }
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    try{
        const userInfo = req.body;
        const cartId = req.cookies.cartId;
    
        const cart = await Cart.findOne({_id: cartId});
        const products = [];
        for(let item of cart.products){
            const objectProduct = {
                productId: item.productId,
                quantity: item.quantity,
            }

            const product = await Product.findOne({_id: item.productId});
            objectProduct.price = product.price;
            objectProduct.discountPercentage = product.discountPercentage;
            products.push(objectProduct);
        }
        
        const objectOrder = {
            cartId: cartId,
            userInfo: userInfo,
            products: products
        }
        
        const order = new Order(objectOrder);
        await order.save();

        // cập nhật lại giỏ hàng khi đã đặt hàng thành công
        await Cart.updateOne({
            _id: cartId,
        }, {
            products: []
        })
        
        res.redirect(`/checkout/success/${order.id}`);
    }
    catch(err){
        res.sendStatus(500);
    }

}

// [GET] /checkout/success/:idOrder
module.exports.success = async (req, res) => {
    const idOrder = req.params.idOrder;
    try{
        const order = await Order.findOne({_id: idOrder});
        if(!order) throw new Error('Không tìm thấy đơn hàng!');

        for(let item of order.products){
            const product = await Product.findOne({_id: item.productId}).select('thumbnail title');
            item.title = product.title;
            item.thumbnail = product.thumbnail;

            item.newPrice = parseInt((100 - item.discountPercentage)/100 * item.price);
            item.totalPrice = item.newPrice * item.quantity;
        }

        order.totalPrice = order.products.reduce((sum, item) => sum +item.totalPrice, 0);
        res.render('./client/pages/checkout/success.pug', {
            title: 'Đặt hàng',
            order: order
        })
    }
    catch(err){
        console.error('[ERROR]',err.message);
        res.sendStatus(500);
    }

}