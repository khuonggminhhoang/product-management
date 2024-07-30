const User = require('./../../models/user.model');

module.exports.notFriend = async (req, res) => {
    const myId = res.locals.user.id;
    _io.once('connection', (socket) => {
        socket.on('CLIENT_REQUEST_FRIEND', async (userId) => {
            // Lưu id của userId vào requestFriends của myId
            const existAInB = await User.findOne({
                _id: myId,
                requestFriends: userId
            });
            if(!existAInB) {
                await User.updateOne({
                    _id: myId
                }, {
                    $push: { requestFriends: userId }
                });
            }

            // Lưu id của myId vào acceptFriends của userId
            const existBInA = await User.findOne({
                _id: userId,
                acceptFriends: myId
            });

            if(!existBInA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myId}
                });
            }

        })
    });

    const userId = res.locals.user.id;
    const users = await User.find({
        _id: {
            $ne: userId
        },
        deleted: false,
        status: 'active'
    })

    res.render('./client/pages/users/not-friend.pug', {
        title: 'Bạn bè',
        users: users
    });
};