const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: String,
    description: String,
    permission: {
        type: Array,
        default: []
    },
    deleted : {
        type: Boolean,
        default: false
    },
    createdBy: {
        accountId: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    updatedBy: {
        accountId: String,
        updateAt: Date
    },
    deletedBy: {
        accountId: String,
        deleteAt: Date
    }
});

module.exports = mongoose.model('Role', roleSchema, 'roles');