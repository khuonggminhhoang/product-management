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