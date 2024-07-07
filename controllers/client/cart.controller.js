const Cart = require('./../../models/cart.models');
const Product = require('./../../models/product.model');

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    try{
        const cart = await Cart.findOne({_id: cartId});
        let totalPrice = 0;
        const products = [];

        for(let item of cart.products){
            const idProduct = item.productId;
            const qty = parseInt(item.quantity);
            const product = await Product.findOne({_id: idProduct});
            product.newPrice = parseInt(((100 - product.discountPercentage)/100) * product.price);
            product.quantity = item.quantity;
            product.totalPrice = product.newPrice * item.quantity;
            totalPrice += qty * product.newPrice;
            products.push(product);
        }        

        res.render('./client/pages/cart/index.pug', {
            title: 'Giỏ hàng',
            products: products,
            totalPrice: totalPrice
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}

// [POST] /cart/add/:id
module.exports.addPOST = async (req, res) => {
    const cardId =  req.cookies.cartId;
    const productId = req.params.id;
    const quantity = parseInt(req.body.quantity);

    try {
        const cart = await Cart.findOne({_id: cardId});
        const currProduct = await Product.findOne({_id: productId});
        const newStock =  currProduct.stock - quantity;

        if(cart){
            const products = cart.products;
            const product = products.find(item => item.productId == productId);
            
            if(product){
                const newQuantity =  product.quantity + quantity;
                // thêm sản phẩm đã tồn tại trong giỏ hàng vào giỏ
                await Cart.updateOne({
                    _id: cardId,
                    'products.productId' : productId   
                }, {
                    $set: {'products.$.quantity': newStock >= 0 ? newQuantity : product.quantity}
                });
                
            }   
            else {
                // Nếu sản phẩm chưa tồn tại thì thêm mới
                await Cart.updateOne({_id: cardId}, {
                    $push: {products: {
                        productId: productId,
                        quantity: quantity
                    }}
                });
            }
        }
    }
    catch(err) {
        res.sendStatus(500);
        return;
    }

    res.redirect('back');
}


