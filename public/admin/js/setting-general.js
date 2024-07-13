// Cập nhật form 
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
            objectMainInfo[input.name] = input.value;
            
        }
        // end object main info

        // start object social link
        const cardSocialLink = document.querySelector('.social-link');
        const inputsSociaLink = cardSocialLink.getElementsByTagName('input'); 
        let prefixPaths = cardSocialLink.querySelectorAll('.social-path'); 
        const objectSocialLink = [];
        for(let i = 0; i < inputsSociaLink.length; ++i) {
            const object = {};
            object.name = inputsSociaLink[i].name;
            object.domain = 'https://' + prefixPaths[i].innerHTML;
            object.path = inputsSociaLink[i].value;
            objectSocialLink.push(object);
        }
        // end object social link

        // start object ecommerce link
        const cardEcommerceLink = document.querySelector('.ecommerce-link');
        const inputsEcommerceLink = cardEcommerceLink.getElementsByTagName('input');
        prefixPaths = cardEcommerceLink.querySelectorAll('.ecommerce-path');

        const objectEcommerceLink = [];
        for(let i = 0; i < inputsEcommerceLink.length; ++i) {
            const object = {};
            object.name = inputsEcommerceLink[i].name;
            object.domain = 'https://' + prefixPaths[i].innerHTML;
            object.path = inputsEcommerceLink[i].value;
            objectEcommerceLink.push(object);
        } 
        // end object ecommerce link
        input.value = JSON.stringify({
            objectMainInfo: objectMainInfo,
            objectSocialLink: objectSocialLink,
            objectEcommerceLink: objectEcommerceLink
        });
        form.submit();
    });
}

// End Cập nhật form

// preview image
const faviconFrame = document.querySelector('.favicon-frame');
const inputFavicon = document.querySelector('[name="favicon"]');
if(faviconFrame) {
    const pencil = faviconFrame.querySelector('.pencil');
    const img = faviconFrame.getElementsByTagName('img')[0];
    pencil.addEventListener('click', () => {
        inputFavicon.click();
    });

    inputFavicon.addEventListener('change', () => {
        const [file] = inputFavicon.files;
        if(file && img) {
            const url = URL.createObjectURL(file);
            img.src = url;
        }
    });
}

const logoFrame = document.querySelector('.logo-frame');
const inputLogo = document.querySelector('[name="logo"]');
if(logoFrame) {
    const pencil = logoFrame.querySelector('.pencil');
    const img = logoFrame.getElementsByTagName('img')[0];

    pencil.addEventListener('click', () => {
        inputLogo.click();
    });

    inputLogo.addEventListener('change', () => {
        const [file] = inputLogo.files;
        if(file && img) {
            const url = URL.createObjectURL(file);
            img.src = url;
        }
    });

}

// END preview image

// Xử lý sự kiện form branch
const formBranch = document.querySelector('.form-branch');
if(formBranch) {
    const deleteBtn = formBranch.querySelector('[delete-btn]');
    const inputNameBranch = formBranch.querySelector('input[name="branchName"]');
    inputNameBranch.addEventListener('change', () => {
        console.log('ok');
        if(inputNameBranch.value) {
            deleteBtn.href = `${deleteBtn.href}?branchName=${inputNameBranch.value}`;
        }
    });
}
// END xử lý sự kiện form branch

