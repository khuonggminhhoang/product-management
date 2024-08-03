const RoomChat = require('./../../models/room-chat.model');

module.exports.isAccess = async (req, res, next) => {
    const roomChatId = req.params.roomChatId;
    const currUserId = res.locals.user.id;
    try {

        const exist = await RoomChat.findOne({
            _id: roomChatId,
            'users.userId': currUserId
        });
        if(!exist) {
            res.redirect('/');
        }
        else{
            next();
        }
    }
    catch(e) {
        res.redirect('/');
    }
}