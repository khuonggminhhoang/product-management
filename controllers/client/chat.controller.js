const roomChatModel = require('../../models/room-chat.model');
const RoomChat = require('../../models/room-chat.model');
const Chat = require('./../../models/chat.model');
const User = require('./../../models/user.model');

const chatSocket = require('./../../sockets/client/chat.socket');

const objectSearchHelper = require('./../../helpers/search');

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    // SOCKET IO
    chatSocket(req, res);
    // End Socket io

    const roomChatId = req.params.roomChatId;

    // Xử lý phần header
    const currRoomChat = await RoomChat.findOne({
        _id: roomChatId,
        deleted: false
    });

    if(currRoomChat.typeRoom == 'friend') {
        const infoUserOfRoom = currRoomChat.users.find(item => item.userId != res.locals.user.id);
        const otherUser = await User.findOne({_id: infoUserOfRoom.userId, deleted: false});
        currRoomChat.title = otherUser.fullName;
        currRoomChat.avatar = otherUser.avatar;
        currRoomChat.statusOnline = otherUser.statusOnline;
    }
    else if(currRoomChat.typeRoom == 'group') {
        currRoomChat.statusOnline = 'online';
    }
    // END

    const chats = await Chat.find({
        deleted: false, 
        roomChatId: roomChatId
    });
     
    for(let chat of chats) {
        const userInfo = await User.findOne({
            _id: chat.userId,
            deleted: false,
            status: 'active'
        }).select('fullName avatar');

        chat.userInfo = userInfo;
    }

    let roomsChat;
    let objectSearch;

    if(req.query.keyword) {
        // lấy ra những người bạn có fullName = keyword 
        objectSearch = objectSearchHelper(req.query)
        const friendListId = res.locals.user.friendList.map(item => item.userId);
    
        const friends = await User.find({                               // tìm trong user những ai có trong ds bạn bè và có tên trùng với tên đang tìm kiếm
            fullName: objectSearch.regex,
            _id: friendListId
        });
    
        const searchFriendIds = friends.map(item => item._id);
        let queryDB;
        if(searchFriendIds.length > 0) {
            queryDB = { 
                $and: [
                    {'users.userId' : res.locals.user.id},
                    {'users.userId' : friends.map(item => item._id)},
                ]
            };
        }
        else {
            queryDB = {
                $and: [
                    {'users.userId' : res.locals.user.id},
                    {title: objectSearch.regex}
                ]
            };
        }
    
        roomsChat = await RoomChat.find(queryDB); 
    }
    else {
        roomsChat = await RoomChat.find({
            'users.userId' : res.locals.user.id
        });
    }

    for(let item of roomsChat) {
        if(item.typeRoom == 'friend') {
            const infoUserOfRoom = item.users.find(item => item.userId != res.locals.user.id);
            const otherUser = await User.findOne({_id: infoUserOfRoom.userId, deleted: false});
            item.title = otherUser.fullName;
            item.avatar = otherUser.avatar;
            item.statusOnline = otherUser.statusOnline;
        } 
        else if(item.typeRoom == 'group') {
            item.statusOnline = 'online';           // tạm thời fix cứng vào đây
        }
    }

    res.render('./client/pages/chat/index.pug', {
        title: 'Chat',
        chats: chats,
        currRoomChat: currRoomChat,
        roomsChat: roomsChat,
        objectSearch: objectSearch
    });
}

module.exports.home = async (req, res) => {
    let roomsChat;
    let objectSearch;

    if(req.query.keyword) {
        // lấy ra những người bạn có fullName = keyword 
        objectSearch = objectSearchHelper(req.query)
        const friendListId = res.locals.user.friendList.map(item => item.userId);
    
        const friends = await User.find({                               // tìm trong user những ai có trong ds bạn bè và có tên trùng với tên đang tìm kiếm
            fullName: objectSearch.regex,
            _id: friendListId
        });
    
        const searchFriendIds = friends.map(item => item._id);
        let queryDB;
        if(searchFriendIds.length > 0) {
            queryDB = { 
                $and: [
                    {'users.userId' : res.locals.user.id},
                    {'users.userId' : friends.map(item => item._id)},
                ]
            };
        }
        else {
            queryDB = {
                $and: [
                    {'users.userId' : res.locals.user.id},
                    {title: objectSearch.regex}
                ]
            };
        }
    
        roomsChat = await RoomChat.find(queryDB); 
    }
    else {
        roomsChat = await RoomChat.find({
            'users.userId' : res.locals.user.id
        });
    }

    for(let item of roomsChat) {
        if(item.typeRoom == 'friend') {
            const infoUserOfRoom = item.users.find(item => item.userId != res.locals.user.id);
            const otherUser = await User.findOne({_id: infoUserOfRoom.userId, deleted: false});
            item.title = otherUser.fullName;
            item.avatar = otherUser.avatar;
            item.statusOnline = otherUser.statusOnline;
        } 
        else if(item.typeRoom == 'group') {
            item.statusOnline = 'online';           // tạm thời fix cứng vào đây
        }
    }

    res.render('./client/pages/chat/home.pug', {
        title: 'Chat',
        roomsChat: roomsChat,
        objectSearch: objectSearch
    });
}