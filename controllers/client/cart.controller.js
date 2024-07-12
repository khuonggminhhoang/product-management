const Cart = require('./../../models/cart.model');
const Product = require('./../../models/product.model');

// [GET] /cart
module.exports.index = async (req, res) => {
    try{
        const cartId = req.cookies.cartId;
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

        const tokenUser = req.cookies.tokenUser;
        const flag = typeof tokenUser === 'string' ? true : false 

        res.render('./client/pages/cart/index.pug', {
            title: 'Giỏ hàng',
            products: products,
            totalPrice: totalPrice,
            flag: flag
        });
    }
    catch(err){
        res.sendStatus(404);
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
                req.flash('success', 'Đã thêm sản phẩm vào giỏ hàng');
            }   
            else {
                // Nếu sản phẩm chưa tồn tại thì thêm mới
                await Cart.updateOne({_id: cardId}, {
                    $push: {products: {
                        productId: productId,
                        quantity: quantity
                    }}
                });
                req.flash('success', 'Đã thêm sản phẩm vào giỏ hàng');
            }

        }
    }
    catch(err) {
        res.sendStatus(500);
        return;
    }

    res.redirect('back');
}

// [GET] /cart/delete/:id       { Không cần bảo mật quá cao nên dùng method GET thay cho DELETE đỡ rườm rà }
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const idProduct = req.params.id;
    try {

        await Cart.updateOne({_id: cartId}, {
            $pull: {
                products: {
                    productId: idProduct
                }
            }
        });
        req.flash('success', 'Xóa sản phẩm thành công khỏi giỏ hàng')
        res.redirect('back');
    }
    catch(err) {
        res.sendStatus(500);
    }
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.params.quantity;   // string
    const cartId = req.cookies.cartId;

    try {
        await Cart.updateOne({
            _id: cartId,
            'products.productId': productId
        }, {
            $set: {
                'products.$.quantity': quantity
            }
        })

        req.flash('success', 'Cập nhật số lượng thành công');
        res.redirect('back');
    }
    catch(err) {
        res.sendStatus(500);
    }
}

