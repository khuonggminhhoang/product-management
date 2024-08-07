import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// FileUploadWithPreview
const upload = new FileUploadWithPreview.FileUploadWithPreview('image-upload', {
    multiple: true,
    maxFileCount: 6
});
// End FileUploadWithPreview

// Xử lý sự kiện gửi tin nhắn
const form = document.querySelector('.chat .inner-form');
if(form) {
    const input = form.querySelector('input[name="content"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = e.target.content.value;
        const images = upload.cachedFileArray;  // arrray images
        const blockInfo = {
            content: content,
            images: images
        }     

        if(content !== "" || images.length > 0) {
            socket.emit('CLIENT_SEND_MESSAGES', blockInfo);
            input.value = "";
            upload.resetPreviewPanel(); // clear all selected images
        }
        socket.emit('CLIENT_SEND_TYPING', 'hidden');  
    });

    input.addEventListener('input', () => {
        socket.emit('CLIENT_SEND_TYPING', 'show');      // show typing 
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    });

}
// End

// Xử lý sự kiện thêm tin nhắn realtime
const chat = document.querySelector('.chat');
if(chat) {
    const innerBody = chat.querySelector('.inner-body');
    const myId = chat.getAttribute('my-id');
    
    socket.on('SERVER_RETURN_MESSAGES', (infoMessage) => {
        const typing = innerBody.querySelector('.typing');
        const div = document.createElement('div');

        let innerAvatar = '';
        let innerName = '';
        if(myId != infoMessage.userId) {
            div.className = 'inner-incoming';
            innerAvatar = `
                <div class='inner-avatar'>
                    <img src=${infoMessage.avatar} />    
                </div>
            `;

            innerName = `
                <small class='inner-name'>${infoMessage.fullName}</small>
            `;
        }     
        else {
            div.className = 'inner-outgoing';
        }

        let innerContent = '';
        if(infoMessage.content != '') {
            innerContent = `<div class='inner-content'>${infoMessage.content}</div>`;
        }

        let innerImage = '';
        if(infoMessage.images.length > 0) {
            innerImage += "<div class='inner-image mr-2'> <div>";
            
            for(let linkImage of infoMessage.images) {
                innerImage += `
                <img src='${linkImage}'>
                `;
            }
            innerImage += "</div> </div>";
        }

        div.innerHTML = `
            ${innerAvatar}
            <div class='inner-text'>
                ${innerName}
                ${innerImage}
                ${innerContent}
            </div>
        `;
        
        if(typing) {
            innerBody.insertBefore(div, typing);
        }
        else {
            innerBody.appendChild(div);
        }

        innerBody.scrollTop = innerBody.scrollHeight;
    });

    // bắt sự kiện typing gửi từ server về client 
    socket.on('SERVER_RETURN_TYPING', ({fullName, state}) => {
        const typing = innerBody.querySelector('.typing');
        if(state == 'show') {
            if(!typing) {
                const div = document.createElement('div');
                div.className = 'typing';
                div.innerHTML = `
                    <small class='inner-name'>${fullName} đang soạn tin</small>
                    <div class='inner-dots'>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                innerBody.appendChild(div);
                innerBody.scrollTop = innerBody.scrollHeight;
            }
        }   
        else {
            if(typing) {
                innerBody.removeChild(typing);
            }
        }
    });

}
// End

// Scroll chat to bottom
const bodyChat = document.querySelector('.chat .inner-body');
if(bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End scroll chat to bottom

// Click icon event
// tham khảo https://github.com/nolanlawson/emoji-picker-element?tab=readme-ov-file#custom-emoji-font
import { polyfillCountryFlagEmojis } from "https://cdn.skypack.dev/country-flag-emoji-polyfill";;

// emoji-picker-element will use "Twemoji Mozilla" and fall back to other fonts for non-flag emoji
polyfillCountryFlagEmojis("Twemoji Mozilla");

const tooltip = document.querySelector('.tooltip');
const btnIcon = document.querySelector('.btn-icon');
Popper.createPopper(btnIcon, tooltip);
btnIcon.addEventListener('click', () => {
    tooltip.classList.toggle('shown');
});

const emojiPicker = document.querySelector('emoji-picker');
if(emojiPicker) {
    emojiPicker.addEventListener('emoji-click', (event) => {
        if(form) {
            const input = form.querySelector('input[name="content"]');
            input.value += event.detail.unicode;

            socket.emit('CLIENT_SEND_TYPING', 'show');
            input.focus();
        }

    });
}

// xử lý sự kiện click vào nơi khác btn-icon thì ẩn icon board
document.addEventListener('click', (e) => {
    const arr = [...e.target.classList];
    if(!arr.includes('btn-icon') && !arr.includes('fa-face-grin-beam') && !arr.includes(...emojiPicker.classList)) {
        tooltip.classList.remove('shown');
    }
})
// End click icon event

// chỉ nhận ảnh đầu vào [chat]
const inputFileUpload = document.querySelector('#file-upload-with-preview-image-upload');
if(inputFileUpload) {
    inputFileUpload.setAttribute('accept', 'image/*');
}


// view fullscreen image
const gallery = new Viewer(document.querySelector('.inner-body'), {
    movable: false,
    rotatable: false,
    tooltip: false,
});


// setting chat
const settingChat = document.querySelector('.chat .setting-chat');
const settingChatIcon = document.querySelector('.chat .setting-chat-icon'); 
if(settingChat && settingChatIcon) {
    settingChatIcon.addEventListener('click', () => {
        settingChat.classList.toggle('d-none');
    });

    const itemSetting = settingChat.querySelectorAll('.item-setting');
    for(let item of itemSetting) {
        const chevronRight = item.querySelector('.fa-chevron-right');
        const chevronDown = item.querySelector('.fa-chevron-down');
        const itemListSettings = item.querySelectorAll('.list-setting .item-list-setting');
        const itemSetting = item.querySelector('.item-setting .item-list-setting');

        itemSetting.addEventListener('click', () => {
            chevronRight.classList.toggle('d-none');
            chevronDown.classList.toggle('d-none');

            itemListSettings.forEach(ils => {
                const arr = [...ils.classList];
                if(arr.includes('d-none')) {
                    ils.classList.remove('d-none');
                }
                else {
                    ils.classList.add('d-none');
                }
            });
        });
    }
}

// Đổi tên đoạn chat
socket.on('RELOAD_PAGE', () => {
    location.reload();
});

const submitNameChat = document.querySelector('[submit-name-chat]');
if(submitNameChat) {
    submitNameChat.addEventListener('click', () => {
        const titleChat = document.querySelector('.modal input[name="title"]');
        socket.emit('CLIENT_EDIT_NAME_GROUP_CHAT', titleChat.value);
    });
}

// Đổi ảnh đoạn chat
const editImage = document.querySelector('.edit-image');
if(editImage) {
    const inputAvatar = editImage.querySelector('input[name="avatar"]');
    editImage.addEventListener('click', () => {
        inputAvatar.click();
    });

    inputAvatar.addEventListener('change', () => {
        const file = inputAvatar.files[0];
        
        if(file) {
            const reader = new FileReader();

            reader.readAsDataURL(file); // bắt đầu đọc file
            reader.onload = (event) => {    
                const buffer = event.target.result;
                socket.emit('CLIENT_CHANGE_AVATAR_GROUP_CHAT', buffer);
            }
        }
    });
}