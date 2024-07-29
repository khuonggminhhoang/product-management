const Chat = require('./../../models/chat.model');

const uploadToCloudinaryHelper = require('./../../helpers/uploadToCloudinary');

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
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
                images: images
            });
            await chat.save();

            _io.emit('SERVER_RETURN_MESSAGES', {
                avatar: res.locals.user.avatar,
                userId: userId,
                fullName: fullName,
                content: blockInfo.content,
                images: images
            }); 
        });

        let timer;          // set time cho dấu nháy sau 3 giây mới ngắt
        socket.on('CLIENT_SEND_TYPING', (state) => {
            socket.broadcast.emit('SERVER_RETURN_TYPING', {
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

    });
}