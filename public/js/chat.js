import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// Xử lý sự kiện gửi tin nhắn
const form = document.querySelector('.chat .inner-form');
if(form) {
    const input = form.querySelector('input[name="content"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_MESSAGES', input.value);
        input.value = "";
    });
}
// End

// Xử lý sự kiện thêm tin nhắn realtime
const chat = document.querySelector('.chat');
if(chat) {
    const innerBody = chat.querySelector('.inner-body');
    const myId = chat.getAttribute('my-id');
    
    socket.on('SERVER_RETURN_MESSAGES', (infoMessage) => {
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
        
        div.innerHTML = `
            ${innerAvatar}
            <div class='inner-text'>
                ${innerName}
                <div class='inner-content'>${infoMessage.content}</div>
            </div>
        `;
        
        innerBody.appendChild(div);

        innerBody.scrollTop = innerBody.scrollHeight;
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
        }

    });
}

// End click icon event