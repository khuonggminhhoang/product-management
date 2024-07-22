// Xử lý sự kiện gửi tin nhắn
const form = document.querySelector('.chat .inner-form');
if(form) {
    const input = form.querySelector('input[name="content"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_MESSAGES', input.value);
        input.value = "";
    });

    socket.on('SERVER_RETURN_MESSAGES', (infoMessage) => {
        console.log(infoMessage);

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
    });
}
// End

