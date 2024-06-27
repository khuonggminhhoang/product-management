const Product = require('./../../models/product.model');
const Account = require('./../../models/account.model');

const objectPaginationHelper = require('./../../helpers/pagination');
const objectSearchHelper = require('./../../helpers/search');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');


// [GET] /admin/trash/products
module.exports.trashProducts = async (req, res) => {
    const query = {
        deleted: true
    }

    // Xử lý tìm kiếm sản phẩm
    const objectSearch = objectSearchHelper(req.query);

    if(objectSearch['product-name']){
        query.title = objectSearch.regex;
    }
    // End


    // Pagination
    const totalProduct = await Product.countDocuments(query);       // đếm số sản phẩm trong db dựa vào query
    const objectPagination = objectPaginationHelper(
        req.query, 
        totalProduct, 
        {
            currentPage: 1,
            limitItems: 10,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )
    
    const skipProduct = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    // End Pagination

    const products = await Product.find(query)
                        .sort({position: 'desc'})
                        .skip(skipProduct)     // truy vấn ra các sản phẩm trong db
                        .limit(objectPagination.limitItems);

    for(let item of products){
        const account = await Account.findOne({_id: item.deletedBy.accountId});
        if(account){
            item.accountFullName = account.fullName;
            item.deleteAt = dateTimeFormatterHelper.formatDateTime(item.deletedBy.deleteAt);
        }
    }

    res.render('./admin/pages/trash/product-deleted.pug', {
        title:'Sản phẩm đã xóa',
        productName: objectSearch['product-name'],
        products: products,
        pagination: objectPagination
    }) 
}

// [PATCH] /admin/trash/products/restore/:id
module.exports.restoredProducts = async (req, res) => {
    try{
        const id = req.params.id;
        await Product.updateOne({_id: id}, {deleted: false});
        req.flash("success", "Khôi phục sản phẩm thành công");
    }
    catch(e) {
        req.flash("success", "Khôi phục sản phẩm thất bại");
    }
    res.redirect('back');
}

// [DELETE] /admin/trash/products/delete-permanent/:id
module.exports.deletedProducts = async (req, res) => {
    try{
        const id = req.params.id;
        await Product.deleteOne({_id: id});
        req.flash("success", "Xóa sản phẩm thành công");
    }
    catch(e) {
        req.flash("success", "Xóa sản phẩm thất bại");
    }
    res.redirect('back');
}