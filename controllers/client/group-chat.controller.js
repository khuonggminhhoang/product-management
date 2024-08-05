const RoomChat = require('../../models/room-chat.model');
const User = require('./../../models/user.model');

// [GET] /group-chat/create
module.exports.create = async (req, res) => {
    const friendListId = res.locals.user.friendList.map(item => item.userId);
    const friends = await User.find({ _id: friendListId }).select('avatar fullName');

    res.render('./client/pages/group-chat/create.pug', {
        title: 'Nhóm chat',
        friends: friends
    });
}

// [POST] /group-chat/create
module.exports.createPOST = async (req, res) => {
    const infoRoomChat = JSON.parse(req.body.infoRoomChat);
    infoRoomChat.users.push({
        userId: res.locals.user.id,
        role: 'superAdmin'
    })
    infoRoomChat.typeRoom = 'group';
    const roomChat = new RoomChat(infoRoomChat);
    roomChat.save();
    
    res.redirect(`/chat/${roomChat.id}`);
}