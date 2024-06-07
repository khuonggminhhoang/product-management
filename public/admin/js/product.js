const btnStatus = document.querySelectorAll('a[status]');

if(btnStatus.length > 0){
    for(let btn of btnStatus){
        const currentStatus = btn.getAttribute('status');           // nếu attribute tự ý đặt thì dùng getAttribute() mới lấy ra được
        const id = btn.id;                                          // ngược lại thì làm như này
        const status = currentStatus == 'active' ? 'inactive' : 'active';
        
        btn.addEventListener('click', () => {
            // console.log(currentStatus, id);
            const formStatus = document.getElementById('form-change-status-product');
            formStatus.action = `${formStatus.getAttribute('url-temp')}/${status}/${id}?_method=PATCH`;
            formStatus.submit();
        });

    }
}