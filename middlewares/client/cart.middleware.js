const Cart =  require('./../../models/cart.models');

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
    else{
        
    }

    next();
}