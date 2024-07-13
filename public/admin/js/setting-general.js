const btnUpdate = document.querySelector('[update]');
if(btnUpdate) {
    btnUpdate.addEventListener('click', () => {
        // Tạo form và gửi tới BE thông qua input
        const form = document.createElement('form');
        document.body.appendChild(form);
        form.action = '/admin/setting/general?_method=PATCH';
        form.method = 'POST';
        form.enctype="multipart/form-data";
        form.style.display = 'none';

        const input = document.createElement('input');
        input.name = 'info-generral';                                   // gửi sang BE với name='info-general'
        form.append(input);
        
        const cardMainInfo = document.querySelector('.main-info');
        const inputFaviconOuter = cardMainInfo.querySelector('input[name="favicon"]')
        const inputLogoOuter = cardMainInfo.querySelector('input[name="logo"]')

        form.append(inputFaviconOuter);
        form.append(inputLogoOuter);

        
        // start object main info
        const inputsInfo = cardMainInfo.getElementsByTagName('input');
        

        const objectMainInfo = {};
        for(let input of inputsInfo) {
            if(input.value){
                objectMainInfo[input.name] = input.value;
            }
        }
        // end object main info

        // start object social link
        const cardSocialLink = document.querySelector('.social-link');
        const inputsSociaLink = cardSocialLink.getElementsByTagName('input'); 
        let prefixPaths = cardSocialLink.querySelectorAll('.social-path'); 
        const objectSocialLink = [];
        for(let i = 0; i < inputsSociaLink.length; ++i) {
            if(inputsSociaLink[i].value) {
                const object = {};
                object.name = inputsSociaLink[i].name;
                object.link = prefixPaths[i].innerHTML + inputsSociaLink[i].value;
                objectSocialLink.push(object);
            }
        }
        // end object social link

        // start object ecommerce link
        const cardEcommerceLink = document.querySelector('.ecommerce-link');
        const inputsEcommerceLink = cardEcommerceLink.getElementsByTagName('input');
        prefixPaths = cardEcommerceLink.querySelectorAll('.ecommerce-path');

        const objectEcommerceLink = [];
        for(let i = 0; i < inputsEcommerceLink.length; ++i) {
            if(inputsEcommerceLink[i].value) {
                const object = {};
                object.name = inputsEcommerceLink[i].name;
                object.link = prefixPaths[i].innerHTML + inputsEcommerceLink[i].value;
                objectEcommerceLink.push(object);
            }
        } 
        // end object ecommerce link
        input.value = JSON.stringify({
            objectMainInfo: objectMainInfo,
            objectSocialLink: objectSocialLink,
            objectEcommerceLink: objectEcommerceLink
        });
        console.log(input.value);
        form.submit();
    });
}