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
const SettingGeneral = require('./../../models/setting-general.model');

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
        title: 'Danh sách đơn hàng', 
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

// [GET] admin/orders/create
module.exports.create = async (req, res) => {
    const arrProduct = await Product.find({deleted: false});

    res.render('./admin/pages/orders/create', {
        title: 'Tạo hóa đơn',
        arrProduct:JSON.stringify(arrProduct)
    });
}

// [GET] admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const order = await Order.findOne({_id: req.params.id, deleted: false});
        const settingGeneral = await SettingGeneral.findOne({});
        order.create = dateTimeFormatterHelper.formatDateTime(order.createdBy.createAt);
        
        const user = await User.findOne({_id: order.userId});
    
        order.deliverdDate = dateTimeFormatterHelper.formatDate(new Date(order.createdBy.createAt.setDate(order.createdBy.createAt.getDate() + 3)));

        let sum = 0;
        let totalQty = 0;
        for(let item of order.products) {
            const product = await Product.findOne({_id: item.productId});
            if(product) {
                item.title = product.title;
                item.cost = parseInt(item.price * ( 1 - item.discountPercentage/100))
                item.totalPrice = item.cost * item.quantity; 
                sum += item.totalPrice;
                totalQty += item.quantity;
            }
        }

        order.totalPrice = sum;
        order.totalQty = totalQty;

        res.render('./admin/pages/orders/detail.pug', {
            title: `Hóa đơn ${ req.params.id.toUpperCase()}`,
            settingGeneral: settingGeneral,
            user: user,
            order: order
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}

// [GET] admin/orders/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const order = await Order.findOne({_id: req.params.id, deleted: false});
        const settingGeneral = await SettingGeneral.findOne({});
        order.create = dateTimeFormatterHelper.formatDateTime(order.createdBy.createAt);
        
        const user = await User.findOne({_id: order.userId});
    
        order.deliverdDate = dateTimeFormatterHelper.formatDate(new Date(order.createdBy.createAt.setDate(order.createdBy.createAt.getDate() + 3)));

        let sum = 0;
        let totalQty = 0;
        for(let item of order.products) {
            const product = await Product.findOne({_id: item.productId});
            if(product) {
                item.title = product.title;
                item.cost = parseInt(item.price * ( 1 - item.discountPercentage/100))
                item.totalPrice = item.cost * item.quantity; 
                sum += item.totalPrice;
                totalQty += item.quantity;
            }
        }

        order.totalPrice = sum;
        order.totalQty = totalQty;

        res.render('./admin/pages/orders/edit.pug', {
            title: `Hóa đơn ${ req.params.id.toUpperCase()}`,
            settingGeneral: settingGeneral,
            user: user,
            order: order
        })
    }
    catch(err){
        res.sendStatus(500);
    }
}


// [PATCH] /admin/orders/edit/:id
module.exports.editPATCH = async (req, res) => {
    if(res.locals.roles.permission.includes('order_edit')){
        try{
            const idOrder = req.params.id;
            const userInfo = {
                fullName: req.body.fullName,
                address: req.body.address,
                phone: req.body.phone
            }

            const products = [];
            if(req.body.quantity.length > 1){
                for(let i = 0; i < req.body.quantity.length; ++i) {
                    const object = {
                        productId: req.body.productId[i],
                        quantity: req.body.quantity[i],
                        price: req.body.price[i],
                        discountPercentage: req.body.discountPercentage[i]
                    };
                    products.push(object);
                }
            }
            else {
                const object = {
                    productId: req.body.productId,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    discountPercentage: req.body.discountPercentage
                };
                products.push(object);
            }
            
            console.log(products);
            for(let item of products) {
                await Order.updateOne({
                    _id: idOrder,
                    'products.productId': item.productId
                }, {
                    'products.$.quantity': item.quantity,
                    'products.$.price': item.price,
                    'products.$.discountPercentage': item.discountPercentage
                })
            }

            
            req.flash('success', 'Cập nhật hóa đơn thành công');
        }
        catch(err) {
            req.flash('error', 'Cập nhật hóa đơn thất bại');
        }
        res.redirect('back');
    }
    else{
        return;
    }
}