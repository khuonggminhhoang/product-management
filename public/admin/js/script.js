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


/* Xử lý logic checkbox sản phẩm */
const checkboxMulti = document.querySelector('[checbox-multi]');
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector('input[name="checkall"]');
    const inputCheckIds = checkboxMulti.querySelectorAll('input[name="id"]');

    inputCheckAll.addEventListener('click', () => {
        if(inputCheckAll.checked){
            inputCheckIds.forEach((item) => {
                item.checked = true;
            });
        }
        else{
            inputCheckIds.forEach((item) => {
                item.checked = false;
            });
        }
    });

    inputCheckIds.forEach((item) => {
        item.addEventListener('click', () => {
            const countCheckbox = checkboxMulti.querySelectorAll('input[name="id"]:checked').length;
            if(countCheckbox == inputCheckIds.length){
                inputCheckAll.checked = true;
            }
            else{
                inputCheckAll.checked = false;
            }
            
        });
    })
}   
/* END */

/* Form multi  */
const formMultiStatus = document.querySelector('#form-change-multi');
if(formMultiStatus) {
    const btnSubmit = formMultiStatus.querySelector('button[type="submit"]');
    const inputSelectedState = formMultiStatus.querySelector('select[name="type"]');
    
    btnSubmit.addEventListener('click', (event) => {
        event.preventDefault();
        const inputsCheckId = checkboxMulti.querySelectorAll('input[name="id"]:checked');

        if(inputsCheckId.length > 0 && inputSelectedState.selectedIndex > 0){
            // giá trị của ô chọn trạng thái
            const type = inputSelectedState.value;

            if(type == 'delete-all'){
                const isConfirm = confirm('Xác nhận xóa các sản phẩm này?');
                if(!isConfirm){
                    return;
                }
            }

            const inputIds = formMultiStatus.querySelector('[name="ids"]')
            const arr = [];

            inputsCheckId.forEach((item) => {
                if(type == 'change-position'){
                    const position = item.closest('.form-check').parentNode.querySelector('input[name="position"]').value;
                    arr.push(`${item.value}-${position}`);
                }
                else{
                    arr.push(item.value);
                }
            });
            inputIds.value = arr.join("; ");

            formMultiStatus.submit();
        }
        else{
            alert("Chọn trạng thái và chọn ít nhất một bản ghi!")
        }

    });
}

/* END */

/* Notification */
const notification = document.querySelector('[show-alert]');
if(notification){
    const time = parseInt(notification.getAttribute('data-time'));
    setTimeout(() => {
        notification.classList.add('show-hidden');
    }, time)

    const btnClose = notification.querySelector('.close');
    btnClose.addEventListener('click', () => {
        notification.classList.add('show-hidden');
    });
}

/* End notification */

/* Preview Image */
const preview = document.querySelector('.preview');
const inputImage = document.querySelector('#thumbnail');
const previewImage = preview.querySelector('#preview-image')
if(inputImage){
    inputImage.onchange = evt => {
        const [file] = inputImage.files;
        if(preview.classList.contains('d-none')){
            preview.classList.remove('d-none');
        }
        else{
            preview.classList.add('d-none');
        }
        if(file && previewImage) {
            previewImage.src = URL.createObjectURL(file);                  // tham khảo stackoverflow https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
            console.log(previewImage.src);
        }
    };
}

const btnDeleted = document.querySelector('[deleted]');
if(btnDeleted) {
    btnDeleted.addEventListener('click', () => {
        inputImage.value = "";
        previewImage.src="";
        preview.classList.add('d-none');
    });
}
/* End Preview Image */