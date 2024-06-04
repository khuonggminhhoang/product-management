/* Xử lý sự kiện các button lọc sản phẩm */
const btnFilters = document.querySelectorAll('button[button-status]');

if(btnFilters.length > 0){
    const url = new URL(window.location.href);

    for(let btn of btnFilters){
        btn.addEventListener('click', () => {

            // cập nhật url
            url.search = '';                            // khi click vào button để lọc thì phải reset lại url để không còn query nào    
            const status = btn.getAttribute('button-status');
            if(status){
                url.searchParams.set('status', status);
            }
            else{
                url.searchParams.delete('status');
            }
            window.location.href = url.href;
        });
    }
}
/* END  */


/* Xử lý sự kiện form tìm kiếm */
const searchForm = document.querySelector('#form-search');
if(searchForm){
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = event.target.elements['product-name'].value;
        // const productName = event.target[0].value;
        
        const url = new URL(window.location.href);
        
        if(productName !== ''){
            url.searchParams.set('product-name', productName);
        }
        else{
            url.searchParams.delete('product-name');                // product-name là name của input, được gửi kèm url khi submit
        }
        window.location.href = url.href;       
    });
}
/* END */

/* Xử lý sự kiện phân trang */
const btnPagination = document.querySelectorAll('[button-page]');
if(btnPagination.length > 0){
    const url = new URL(window.location.href);

    for(let btn of btnPagination){
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('button-page');
            url.searchParams.set('page', page);
            window.location.href = url.href; 
        });
    }
}
/* END */
