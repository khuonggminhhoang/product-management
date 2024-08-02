const User = require('./../../models/user.model');

module.exports = (res) => {
    const fromUserId = res.locals.user.id;
    _io.once('connection', (socket) => {
        // objectId lưu cặp toUserId - socketId tương ứng để hiển thị thông báo ra giao diện
        objectId[fromUserId] = socket.id;
        // Thêm bạn bè
        socket.on('CLIENT_ADD_FRIEND', async (toUserId) => {
            // Lưu id của toUserId vào requestFriends của fromUserId
            const existAInB = await User.findOne({
                _id: fromUserId,
                requestFriends: toUserId
            });
            if(!existAInB) {
                await User.updateOne({
                    _id: fromUserId
                }, {
                    $push: { requestFriends: toUserId }
                });
            }

            // Lưu id của fromUserId vào acceptFriends của toUserId
            const existBInA = await User.findOne({
                _id: toUserId,
                acceptFriends: fromUserId
            });

            if(!existBInA) {
                await User.updateOne({
                    _id: toUserId
                }, { 
                    $push: { acceptFriends: fromUserId}
                });
            }

            const toUser = await User.findOne({_id: toUserId}).select('acceptFriends');
            const fromUser = await User.findOne({_id: fromUserId}).select('avatar fullName');

            if(objectId[toUserId]) {
                // gửi tới client để sửa giao diện card nút thêm bạn bè thành nút xác nhận
                socket.to( objectId[toUserId] ).emit('SERVER_NOTIFICATION_ADD_FRIEND', fromUserId);

                // gửi tới client để chỉnh giao diện số lời mời kết bạn
                socket.to( objectId[toUserId] ).emit('SERVER_RETURN_ACCEPT_QUANTITY', {
                    acceptQty: toUser.acceptFriends.length,
                    fromUser: fromUser
                });
            }
        });

        // Từ chối kết bạn
        socket.on('CLIENT_DENIED_FRIEND', async (toUserId) => {
            // kiểm tra xem toUserId có nằm trong acceptFriends không
            let exist = await User.findOne({
                _id: fromUserId,
                acceptFriends: toUserId 
            });

            if(exist) {
                await User.updateOne({
                    _id: fromUserId
                }, {
                    $pull: {acceptFriends: toUserId}
                });
            }

            // kiểm tra xem fromUserId có nằm trong requestFriends không
            exist = await User.findOne({
                _id: toUserId,
                requestFriends: fromUserId
            });

            if(exist) {
                await User.updateOne({
                    _id: toUserId
                }, {
                    $pull: { requestFriends: fromUserId}
                });
            }

            // if(objectId[toUserId]) {
            //     // gửi tới client để sửa giao diện card đã gửi thành thêm và xóa
            //     socket.to( objectId[toUserId] ).emit('SERVER_NOTIFICATION_DENIED_FRIEND', fromUserId);
            // }

        });

        // Hủy lời mời kết bạn
        socket.on('CLIENT_CANCEL_FRIEND', async (toUserId) => {
            // Kiểm tra xem toUserId có nằm trong requestFriends của fromUserId không
            let exist = await User.findOne({
                _id: fromUserId,
                requestFriends: toUserId
            });

            if(exist) {
                await User.updateOne({
                    _id: fromUserId
                }, {
                    $pull: { requestFriends: toUserId }
                });
            }

            // Kiểm tra xem fromUserId có nằm trong acceptFriends của toUserId không
            exist = await User.findOne({
                _id: toUserId,
                acceptFriends: fromUserId
            });

            if(exist) {
                await User.updateOne({
                    _id: toUserId
                }, {
                    $pull: { acceptFriends: fromUserId}
                });
            }

            const toUser = await User.findOne({_id: toUserId}).select('acceptFriends');
            const fromUser = await User.findOne({_id: fromUserId}).select('avatar fullName');

            if(objectId[toUserId]) {
                // gửi tới client để sửa giao diện card xác nhận thành thêm bạn và xóa
                socket.to( objectId[toUserId] ).emit('SERVER_NOTIFICATION_CANCEL_FRIEND', fromUserId);
                // gửi tới client để chỉnh giao diện số lời mời kết bạn
                socket.to( objectId[toUserId] ).emit('SERVER_RETURN_ACCEPT_QUANTITY', {
                    acceptQty: toUser.acceptFriends.length,
                    fromUser: fromUser
                });
            }

        });

        // Xác nhận kết bạn
        socket.on('CLIENT_ACCEPT_FRIEND', async (toUserId) => {
            // xóa toUserId trong acceptFriends của fromUserId
            await User.updateOne({
                _id: fromUserId
            }, {
                $pull: { acceptFriends: toUserId }
            });

            // đẩy toUserId vào friendList của fromUserId
            await User.updateOne({
                _id: fromUserId
            }, {
                $push: {
                    friendList: { 
                        userId: toUserId, 
                        roomChatId: ''
                    }
                }
            });

            // đẩy fromUserId vào friendList của toUserId
            await User.updateOne({
                _id: toUserId
            }, {
                $push: {
                    friendList: { 
                        userId: fromUserId,
                        roomChatId: ''
                    }
                }
            });

            // xóa fromUserId trong requestFriends của toUserId
            await User.updateOne({
                _id: toUserId
            }, {
                $pull: { requestFriends: fromUserId }
            });

        });

        // Hủy kết bạn
        socket.on('CLIENT_UNFRIEND', async (toUserId) => {
            await User.updateOne({
                _id: fromUserId
            }, {
                $pull: {
                    friendList: { 
                        userId: toUserId
                    }
                }
            });
            
            await User.updateOne({
                _id: toUserId
            }, {
                $pull: {
                    friendList: { 
                        userId: fromUserId
                    }
                }
            });

            if(objectId[toUserId]) {
                // gửi tới client để sửa giao diện card thành thêm bạn và xóa
                socket.to( objectId[toUserId] ).emit('SERVER_NOTIFICATION_UNFRIEND', fromUserId);
            }

        });
    });
}