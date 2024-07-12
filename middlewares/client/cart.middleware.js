const Cart =  require('./../../models/cart.model');
const User = require('./../../models/user.model');

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId){
        try {
            const cart = new Cart();
            await cart.save();
            
            const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);

            res.cookie('cartId', cart.id, {expires: expires});
        }
        catch(err) {
            res.sendStatus(500);
            return;
        }   
    }
    else if(!req.cookies.tokenUser) {
        try {
            const cart = await Cart.findOne({_id: req.cookies.cartId});
            if(!cart){
                throw new Error('Không tìm thấy cart trong db');
            }
            cart.total = cart.products.reduce((total, item) => total + item.quantity, 0); 
            
            res.locals.miniCart = cart;
        }
        catch(err) {
            res.status(500).send(err.message);
        }
    }
    else {
        try {

            const user = await User.findOne({tokenUser: req.cookies.tokenUser});
            if(!user) throw new Error('Không tìm được user hợp lệ trong db');

            const cart = await Cart.findOne({userId: user.id});
            if(!cart) throw new Error('Không tìm thấy cart trong db');

            if(cart.id != req.cookies.cartId) {
                await Cart.deleteOne({_id: req.cookies.cartId});
            }
            
            cart.total = cart.products.reduce((total, item) => total + item.quantity, 0); 
            
            res.locals.miniCart = cart;
            res.cookie('cartId', cart.id);
        }
        catch(err) {
            res.status(500).send(err.message);
        }
    }

    next();
}