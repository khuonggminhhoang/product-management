const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: String,
    roomChatId: String,
    content: String,
    images: Array,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
})

module.exports = mongoose.model('Chat', chatSchema, 'chats');