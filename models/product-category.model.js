const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schemaProductCategory = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: {
        type: String,
        default:''
    },
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
    }
});


module.exports = mongoose.model('ProductCategory', schemaProductCategory, 'products-category');