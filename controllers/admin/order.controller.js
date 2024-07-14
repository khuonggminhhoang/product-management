const createTreeHelper = require('./../../helpers/createTree');
const objectPaginationHelper = require('./../../helpers/pagination');
const objectSearchHelper = require('./../../helpers/search');
const filterStatusHelper = require('./../../helpers/filterStatus');
const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');

const systemConfig = require('./../../config/system');

const User = require('./../../models/user.model');
const Product = require('./../../models/product.model');
const ProductCategory = require('./../../models/product-category.model');
const Account = require('./../../models/account.model');
const Order = require('./../../models/order.model');

// [GET] /admin/orders
module.exports.index = async (req, res) => {
    // Xử lý các nút lọc
    const filterStatus = [
        {
            name: 'Tất cả',
            class: 'active',  // cặp key-value này chỉ có tác dụng bôi xanh nút click vì thêm class active của Bootstrap 4 vào element
            status: ''
        },
        {
            name: 'Đã giao hàng',
            class: '',
            status: 'delivered'
        },
        {
            name: 'Đang giao',
            class: '',
            status: 'in transit'
        },
        {
            name: 'Gửi hàng',
            class: '',
            status: 'shipped'
        },
        { 
            name: 'Đang xử lý',
            class: '',
            status: 'processing'
        },
        {
            name: 'Xác nhận',
            class: '',
            status: 'confirmed'
        },
        {
            name: 'Đã hủy',
            class: '',
            status: 'canceled'
        }
    ]
    
    if(req.query.status){
        // cập nhật trạng thái button khi click
        for(let item of filterStatus){
            item.class = item.status == req.query.status ? 'active' : '';
        }
    }
    // End

    const query = {
        deleted: false
    }

    if(req.query.status){
        query.status = req.query.status;
    }

    // Xử lý tìm kiếm sản phẩm
    const objectSearch = objectSearchHelper(req.query);

    if(objectSearch.target){
        // query.id = objectSearch.regex;
        query.id = req.query.key;
    }
    // End

    // Pagination
    const totalOrder = await Order.countDocuments(query);       // đếm số sản phẩm trong db dựa vào query
    const objectPagination = objectPaginationHelper(
        req.query, 
        totalOrder, 
        {
            currentPage: 1,
            limitItems: 10,   // số sp trong 1 trang sản phẩm khi phân trang
            totalPage: 1
        }
    )

    const skipOrder = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    // End Pagination

    // Sort
    const sort = {};
    if(req.query.sortBy && req.query.order){
        sort[req.query.sortBy] = req.query.order;
    }
    else{
        sort.position = 'desc';
    }
    
    // End Sort
    const orders = await Order.find(query)
                        .sort(sort)
                        .skip(skipOrder)     // truy vấn ra các sản phẩm trong db
                        .limit(objectPagination.limitItems);

    for(let item of orders){
        const accountCreate = await Account.findOne({_id: item.createdBy.accountId});
        item.createAt = dateTimeFormatterHelper.formatDateTime(item.createdBy.createAt);
        if(accountCreate){
            item.accountFullNameCreate = accountCreate.fullName;
        }

        const accountUpdate = await Account.findOne({_id: item.updatedBy.accountId});
        if(accountUpdate){
            item.accountFullNameUpdate = accountUpdate.fullName;
            item.updateAt = dateTimeFormatterHelper.formatDateTime(item.updatedBy.updateAt);
        }
        const user = await User.findOne({_id: item.userId, deleted: false});
        item.userName = user.fullName;
        item.totalPrice = item.products.reduce((sum, ord) => sum + ord.quantity * ord.price * (1 - ord.discountPercentage/100), 0)
    }

    res.render('./admin/pages/orders/index.pug', {
        title: 'Danh sách sản phẩm', 
        orders: orders,
        filterStatus: filterStatus, 
        orderName: objectSearch.target,
        pagination: objectPagination
    });
 
};  

// [PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    if(res.locals.roles.permission.includes('order_edit')){
        const id = req.params.id;
        const status = req.params.status;
        try{
            await Order.updateOne({_id: id}, {
                status: status,
                updatedBy: {
                    accountId: res.locals.account.id,
                    updateAt: new Date()
                }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
        }
        catch(e) {
            req.flash("error", "Cập nhật trạng thái thất bại");
        }
    
        res.redirect('back');                               // chuyển hướng trang lại url trang hiện tại
    }
    else{
        return;
    }
};

// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
    if(res.locals.roles.permission.includes('order_edit')){

        const type = req.body.type;
        const ids = req.body.ids;
        const arrId = ids.split("; ");
        const updatedBy = {
            accountId: res.locals.account.id,
            updateAt: new Date()
        }
        switch(type){
            case 'delivered':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'delivered', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'in transit':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'in transit', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'shipped':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'shipped', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'processing':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'processing', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'confirmed':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'confirmed', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'canceled':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {status: 'canceled', updatedBy: updatedBy});
                    req.flash("success", "Cập nhật trạng thái thành công")
                }
                catch(e) {
                    req.flash("error", "Cập nhật trạng thái thất bại");
                }
                break;
    
            case 'delete-all':
                try{
                    await Order.updateMany({_id: {$in: arrId}}, {
                        deleted: true,  
                        deletedBy: {
                            accountId: res.locals.account.id,
                            deleteAt: new Date()
                        },
                        updatedBy: updatedBy
                    });
                    
                    req.flash("success", "Xóa bài viết thành công")
                }
                catch(e) {
                    req.flash("error", "Xóa bài viết thất bại");
                }
                break;
    
            default:
                break;
        }
    
        res.redirect('back');
    }
    else{
        return;
    }
};

// [DELETE]/admin/orders/delete/:id
module.exports.delete = async (req, res) => {
    if(res.locals.roles.permission.includes('order_delete')){
        try {
            const id = req.params.id;
            await Order.updateOne({_id: id}, {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.account.id,
                    deleteAt: new Date()
                }
            })
    
            req.flash('success', 'Xóa hóa đơn thành công');
        }
        catch(err){
            req.flash('error', 'Xóa hóa đơn thất bại');
        }
        res.redirect('back');
    }
    else{
        return;
    }
}