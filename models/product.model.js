const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');          // dùng thư viện mongoose-slug-updater để khởi tạo giá trị slug mỗi khi tạo sản phẩm mới
mongoose.plugin(slug);

const schemaProduct = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: ['title','_id'],                      // san-pham-dsfh123jh3hb2
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

module.exports = mongoose.model('Product', schemaProduct, 'products');