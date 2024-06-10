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