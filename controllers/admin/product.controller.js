const Product = require('./../../models/product.model');

// [GET] /admin/products
const index = async (req, res) => {
    // mảng lưu các object thông tin của button
    const filterStatus = [
        {
            name: 'Tất cả',
            class: 'active',  // cặp key-value này chỉ có tác dụng bôi xanh nút click vì thêm class active của Bootstrap 4 vào element
            status: ''
        },
        {
            name: 'Hoạt động',
            class: '',
            status: 'active'
        },
        {
            name: 'Dừng hoạt động',
            class: '',
            status: 'inactive'
        }
    ]
    
    const query = {
        deleted: false
    }

    if(req.query.status){
        query.status = req.query.status;
        
        // cập nhật trạng thái button khi click
        for(let item of filterStatus){
            item.class = item.status == req.query.status ? 'active' : '';
        }
    }

    if(req.query['product-name']){
        query.title = { $regex: new RegExp(req.query['product-name'], 'i')};
    }
    console.log(query);

    const products = await Product.find(query);     // truy vấn ra tất cả các sản phẩm trong db
    res.render('./admin/pages/products/index.pug', {title: 'Danh sách sản phẩm', products, filterStatus, productName: req.query['product-name']});
};

module.exports = {index};