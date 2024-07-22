// [GET] /chat
module.exports.index = (req, res) => {
    // SOCKET IO
    global._io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGES', (msg) => {
            // Gửi lại tới client
            socket.emit('SERVER_RETURN_MESSAGES', `${socket.id}: ${msg}`);
    
        })
    });
    
    // END
    res.render('./client/pages/chat/index.pug', {
        title: 'Chat'
    });
}