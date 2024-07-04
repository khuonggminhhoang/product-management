const Cart = require('./../../models/cart.models');
const Product = require('./../../models/product.model');

// [POST] /cart/add/:id
module.exports.addPOST = async (req, res) => {
    const cardId =  req.cookies.cartId;
    const productId = req.params.id;
    const quantity = req.body.quantity;

    try {
        const cart = await Cart.findOne({_id: cardId});
        const currProduct = await Product.findOne({_id: productId});
        const newStock = currProduct.stock - quantity;

        if(cart){
            const products = cart.products;
            const product = products.find(item => item.productId == productId);
            const newQuantity = product.quantity + quantity;

            if(product){
                // thêm sản phẩm đã tồn tại trong giỏ hàng vào giỏ
                await Cart.updateOne({
                    _id: cardId,
                    'products.productId' : productId   
                }, {
                    $set: {'products.$.quantity': newStock >= 0 ? newQuantity : product.quantity}
                });
                
                // giảm stock của product khi thêm hàng vào giỏ
                await Product.updateOne({_id: productId},{
                    $set: {stock: newStock >= 0 ? newStock : currProduct.stock}
                })
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

