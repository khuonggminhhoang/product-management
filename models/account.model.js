const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        defaut: ""
    },
    phone: String,
    avatar: String,
    roleId: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema, 'accounts');