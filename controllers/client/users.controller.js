const User = require('./../../models/user.model');
const usersSocket = require('./../../sockets/client/users.socket');

module.exports.notFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;
    const me = await User.findOne({
        _id: userId
    });

    const requestFriends = me.requestFriends;
    const acceptFriends = me.acceptFriends;
    const arr = me.friendList;
    const friendListId = arr.map(item => item.userId);

    const users = await User.find({
        $and: [
            { _id: { $ne : userId } },
            { _id: { $nin: requestFriends} },
            { _id: { $nin: acceptFriends} },
            { _id: { $nin: friendListId} }

        ],
        deleted: false,
        status: 'active'
    }).select('avatar fullName').limit(114);

    res.render('./client/pages/users/not-friend.pug', {
        title: 'Bạn bè',
        users: users
    });
};