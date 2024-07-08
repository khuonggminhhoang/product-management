const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products: [
        {
            productId: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema, 'orders');