const Chat = require('./../../models/chat.model');
const RoomChat = require('./../../models/room-chat.model');

const uploadToCloudinaryHelper = require('./../../helpers/uploadToCloudinary');

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;

    _io.once('connection', (socket) => {
        // join socket vào phòng
        socket.join(roomChatId);    

        socket.on('CLIENT_SEND_MESSAGES', async (blockInfo) => {
            // Gửi lại tới client
            const images = [];
            for(let imageBuffer of blockInfo.images) {
                const linkImage = await uploadToCloudinaryHelper.uploadImages(imageBuffer);
                images.push(linkImage);
            }

            const chat = new Chat({
                userId: userId,
                content: blockInfo.content,
                images: images,
                roomChatId: roomChatId
            });
            await chat.save();

            // gửi đến tất cả mọi người trong phòng chat, kể cả người gửi
            _io.to(roomChatId).emit('SERVER_RETURN_MESSAGES', {
                avatar: res.locals.user.avatar,
                userId: userId,
                fullName: fullName,
                content: blockInfo.content,
                images: images
            }); 
        });

        // Hiệu ứng typing
        let timer;          // set time cho dấu nháy sau 3 giây mới ngắt
        socket.on('CLIENT_SEND_TYPING', (state) => {
            // gửi sự kiện này tới tất cả mọi người, trừ người gửi 
            socket.to(roomChatId).emit('SERVER_RETURN_TYPING', {
                fullName: fullName,
                state: state
            });
            
            if(state == 'show') {
                clearTimeout(timer);

                timer = setTimeout(() => {
                    socket.broadcast.emit('SERVER_RETURN_TYPING', 'hidden');
                }, 3000);
            }
        });

        socket.on('CLIENT_EDIT_NAME_GROUP_CHAT', async (title) => {
            await RoomChat.updateOne({_id: roomChatId}, {title: title});
            socket.emit('RELOAD_PAGE');
        })

        socket.on('CLIENT_CHANGE_AVATAR_GROUP_CHAT', async (buffer) => {
            const linkImage = await uploadToCloudinaryHelper.uploadImages(buffer);
            await RoomChat.updateOne({_id: roomChatId}, {
                avatar: linkImage
            });

            socket.emit('RELOAD_PAGE');
        });

        socket.on('CLIENT_REMOVE_USER_GROUP_CHAT', async (removeUserId) => {
            await RoomChat.updateOne({_id: roomChatId}, {
                $pull: {
                    users: {
                        userId: removeUserId
                    } 
                }
            });
            socket.emit('RELOAD_PAGE');
        });

        socket.on('CLIENT_ADD_FRIEND_GROUP_CHAT', async (arrayUserId) => {
            for(let userId of arrayUserId) {
                await RoomChat.updateOne({
                    _id: roomChatId
                }, {
                    $push: {
                        users: {
                            userId: userId,
                            role: 'user'
                        }
                    }
                    
                })
            }

            socket.emit('RELOAD_PAGE');
        });

        socket.on('CLIENT_OUT_GROUP_CHAT', async () => {
            await RoomChat.updateOne({
                _id: roomChatId
            }, {
                $pull: {
                    users: {
                        userId: userId
                    }
                }
            })

            socket.emit('RELOAD_PAGE');
        });

        socket.on('CLIENT_DELETE_GROUP_CHAT', async () => {
            await RoomChat.updateOne({
                _id: roomChatId
            }, {
                deleted: true,
                deletedAt: new Date()
            });

            socket.emit('RELOAD_PAGE');
        })
    });
}