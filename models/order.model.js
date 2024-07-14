const mongoose = require('mongoose');
const mongodb = require('mongodb');

const orderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    status: {
        type: String,
        default: 'confirmed'
    },
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
    ],
    createdBy: {
        accountId: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        accountId: String,
        deleteAt: Date            
    },
    updatedBy: {
        accountId: String,
        updateAt: Date
    }, 
    deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Order', orderSchema, 'orders');