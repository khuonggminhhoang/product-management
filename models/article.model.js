const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');          // dùng thư viện mongoose-slug-updater để khởi tạo giá trị slug mỗi khi tạo sản phẩm mới
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    thumbnail: String,
    status: String,
    position: Number,
    featured: {
        type: Boolean,
        default: false
    },
    articleCategoryId: {
        type: String,
        default: ''
    },
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: ['title','_id'],                      // san-pham-dsfh123jh3hb2
        unique: true
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

module.exports = mongoose.model('Article', articleSchema, 'articles');