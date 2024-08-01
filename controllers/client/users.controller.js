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

module.exports.requestFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;
    const me = await User.findOne({
        _id: userId
    });

    const users = await User.find({
        _id: me.requestFriends,
        deleted: false,
        status: 'active'
    }).select('avatar fullName');

    res.render('./client/pages/users/request.pug', {
        title: 'Bạn bè',
        users: users
    });

}

module.exports.acceptFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket

    const userId = res.locals.user.id;
    const me = await User.findOne({
        _id: userId
    });

    const users = await User.find({
        _id: me.acceptFriends,
        deleted: false,
        status: 'active'
    }).select('avatar fullName');

    res.render('./client/pages/users/accept.pug', {
        title: 'Bạn bè',
        users: users
    });
}

module.exports.friendsFriend = async (req, res) => {
    // Socket
    usersSocket(res);
    // End Socket
    const userId = res.locals.user.id;
    const me = await User.findOne({
        _id: userId
    });

    const arrId = me.friendList.map(item => item.userId);

    const users = await User.find({
        _id: arrId,
        deleted: false,
        status: 'active'
    });
    
    res.render('./client/pages/users/friends.pug', {
        title: 'Bạn bè',
        users: users
    });
}