const User = require('./../../models/user.model');

module.exports.notFriend = async (req, res) => {
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