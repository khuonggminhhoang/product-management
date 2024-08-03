const Chat = require('./../../models/chat.model');
const User = require('./../../models/user.model');

const chatSocket = require('./../../sockets/client/chat.socket');

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    // SOCKET IO
    chatSocket(req, res);
    // End Socket io

    const chats = await Chat.find({
        deleted: false, 
        roomChatId: req.params.roomChatId
    });
     
    for(let chat of chats) {
        const userInfo = await User.findOne({
            _id: chat.userId,
            deleted: false,
            status: 'active'
        }).select('fullName avatar');

        chat.userInfo = userInfo;
    }
    
    // END
    res.render('./client/pages/chat/index.pug', {
        title: 'Chat',
        chats: chats
    });
}

