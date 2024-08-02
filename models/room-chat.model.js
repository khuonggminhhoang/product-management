const mongoose = require('mongoose');

const roomChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    typeRoom: String,  // friend or group
    status: String,     // locked or ...
    users: [
        {
            userId: String,
            role: String            // superAdmin / admin / user
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('RoomChat', roomChatSchema, 'rooms-chat');
