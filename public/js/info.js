
const cardInfo = document.querySelector('.info');
if(cardInfo){
    // Preview avatar
    const preview = cardInfo.querySelector('.preview-image');

    if(preview){
        const buttonChoose = preview.querySelector('[btn-choose]');
        const inputTemp = preview.querySelector('[input-temp]');
        const imgAvatar = preview.querySelector('#avatar');
        
        buttonChoose.addEventListener('click', () => {
            inputTemp.click();
        });
        
        inputTemp.addEventListener('change', () => {
            const [file] = inputTemp.files;
            if(file && imgAvatar) {
                const url = URL.createObjectURL(file);
                imgAvatar.src = url;
            }
        });
    }
    // End preview avatar

    // arrow-circle change phone number
    const formChangePhone = document.querySelector('[form-change-phone]');
    const btnOk = formChangePhone.querySelector('[btn-ok]');
    if(btnOk) {
        btnOk.addEventListener('click', () => {
            const phone = formChangePhone.querySelector('input[name="phone"]').value;
            const regex = /^(0|\+84)\d{3}[ ]?\d{3}[ ]?\d{3}$/;
            if(phone && phone.match(regex)){
                cardInfo.querySelector('#phone-number').innerHTML = phone;
                cardInfo.querySelector('input[name="phone"]').value = phone;
            }
        });
    }

}