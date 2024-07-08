const Cart =  require('./../../models/cart.models');

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        try {
            const cart = new Cart();
            await cart.save();
            console.log('Tạo cart mới');
            
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);

            res.cookie('cartId', cart.id, {expires: expires});
        }
        catch(err) {
            res.sendStatus(500);
            return;
        }   
    }
    else{
        const cart = await Cart.findOne({_id: req.cookies.cartId});
        console.log('Tìm cart', req.cookies.cartId);
        if(!cart){
            res.sendStatus(500);
            return;
        }
        cart.total = cart.products.reduce((total, item) => total + item.quantity, 0);

        res.locals.miniCart = cart;
    }

    next();
}