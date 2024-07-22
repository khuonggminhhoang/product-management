// [GET] /chat
module.exports.index = (req, res) => {
    // SOCKET IO
    global._io.on('connection', (socket) => {
        socket.on('CLIENT_SEND_SERVER', (msg) => {
            // Gửi lại tới client
            socket.emit('SERVER_SEND_CLIENT', `${socket.id}: ${msg}`);
    
        })
    });
    
    // END
    res.render('./client/pages/chat/index.pug', {
        title: 'Chat'
    });
}