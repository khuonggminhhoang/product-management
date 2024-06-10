const mongoose = require('mongoose');

const schemaProduct = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean,
    deleteAt: Date
});

module.exports = mongoose.model('Product', schemaProduct, 'products');