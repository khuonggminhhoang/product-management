module.exports = (query) => {
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
    
    if(query.status){
        // cập nhật trạng thái button khi click
        for(let item of filterStatus){
            item.class = item.status == query.status ? 'active' : '';
        }
    }

    return filterStatus;
}