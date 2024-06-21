const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schemaProductCategory = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    parentId: {
        type: String,
        default: ''
    },
    slug: {
        type: String,
        slug: 'title',                      // danh-muc
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});


module.exports = mongoose.model('ProductCategory', schemaProductCategory, 'products-category');