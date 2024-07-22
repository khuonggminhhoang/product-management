const socket = io();

const form = document.querySelector('.inner-form');
if(form) {
    const input = form.querySelector('input[name="message"]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('CLIENT_SEND_SERVER', input.value);
        input.value = "";
    });

    socket.on('SERVER_SEND_CLIENT', (msg) => {
        console.log(msg);
    });
}