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

    });

    const chats = await Chat.find({
        deleted: false
    });
     
    for(let chat of chats) {
        const userInfo = await User.findOne({
            _id: chat.userId
        }).select('fullName avatar');

        chat.userInfo = userInfo;
    }
    
    // END
    res.render('./client/pages/chat/index.pug', {
        title: 'Chat',
        chats: chats
    });
}