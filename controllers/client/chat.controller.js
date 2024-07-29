const Chat = require('./../../models/chat.model');
const User = require('./../../models/user.model');

const chatSocket = require('./../../sockets/client/chat.socket');

// [GET] /chat
module.exports.index = async (req, res) => {
    // SOCKET IO
    chatSocket(res);
    // End Socket io

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