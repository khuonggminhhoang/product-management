const Chat = require('./../../models/chat.model');
const User = require('./../../models/user.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    // SOCKET IO
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGES', async (content) => {
            // Gửi lại tới client
            const chat = new Chat({
                userId: userId,
                content: content
            });
            await chat.save();

            _io.emit('SERVER_RETURN_MESSAGES', {
                avatar: res.locals.user.avatar,
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

        let timer;          // set time cho dấu nháy sau 3 giây mới ngắt
        socket.on('CLIENT_SEND_TYPING', (state) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
                fullName: fullName,
                state: state
            });
            
            if(state == 'show') {
                clearTimeout(timer);

                timer = setTimeout(() => {
                    socket.broadcast.emit('SERVER_RETURN_TYPING', 'hidden');
                }, 3000);
            }
        });

    });

    const chats = await Chat.find({
        deleted: false
    });
     
    for(let chat of chats) {
        const userInfo = await User.findOne({
            _id: chat.userId,
            deleted: false
        }).select('fullName avatar');

        chat.userInfo = userInfo;
    }
    
    // END
    res.render('./client/pages/chat/index.pug', {
        title: 'Chat',
        chats: chats
    });
}