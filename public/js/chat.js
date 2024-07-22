const form = document.querySelector('.inner-form');
if(form) {
    const input = form.querySelector('input[name="message"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_MESSAGES', input.value);
        input.value = "";
    });

    socket.on('SERVER_RETURN_MESSAGES', (msg) => {
        console.log(msg);
    });
}