// Status product
const btnStatus = document.querySelectorAll('a[status]');

if(btnStatus.length > 0){
    for(let btn of btnStatus){
        const currentStatus = btn.getAttribute('status');           // nếu attribute tự ý đặt thì dùng getAttribute() mới lấy ra được
        const id = btn.id;                                          // ngược lại thì làm như này
        const status = currentStatus == 'active' ? 'inactive' : 'active';


        btn.addEventListener('click', () => {
            // console.log(currentStatus, id);
            const formStatus = document.getElementById('form-change-status-product');
            const path = formStatus.getAttribute('path');
            formStatus.action = `${path}/${status}/${id}?_method=PATCH`;
            formStatus.submit();
        });

    }
}
// END 

// Delete Products
const buttonsDelete = document.querySelectorAll('[button-delete-product]');

if(buttonsDelete.length > 0){
    buttonsDelete.forEach((button) => {
        button.addEventListener('click', () => {
            const cf = confirm('Có chắc chắn muốn xóa sản phẩm không?');

            if(cf == true){
                const idProduct = button.getAttribute('data-id');
                const deleteForm = document.querySelector('#form-delete-product');
                const path = deleteForm.getAttribute('path');
                const action = `${path}/${idProduct}?_method=DELETE`;
    
                deleteForm.action = action;
                deleteForm.submit();
            }
        });
    });

}
// END

// Xử lý sự kiện nút khôi phục trong trang [admin/trash/products]
const btnRestoreds = document.querySelectorAll('[restored-button]');
if(btnRestoreds.length > 0){
    btnRestoreds.forEach((btn) => {
        btn.addEventListener('click' ,() => {
            const id = btn.getAttribute('data-id');
            const restoredForm = document.querySelector('#form-restored');
            const path = restoredForm.getAttribute('path');
            restoredForm.action = `${path}/restore/${id}?_method=PATCH`;
            restoredForm.submit();
        }); 
    });
}
// END

// Xử lý sự kiện nút xóa vĩnh viễn trong trang [admin/trash/products]
const btnDeletedPermanents = document.querySelectorAll('[deleted-permanent-button]');
if(btnDeletedPermanents.length > 0){
    btnDeletedPermanents.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cf = confirm("Xác nhận xóa sản phẩm?");

            if(cf){
                const id = btn.getAttribute('data-id');
                const formDeletedPermanent = document.querySelector('#form-deleted-permanent');
                const path = formDeletedPermanent.getAttribute('path');
                formDeletedPermanent.action = `${path}/delete-permanent/${id}?_method=DELETE`;
                formDeletedPermanent.submit();
            }
        });
    });
}


//END