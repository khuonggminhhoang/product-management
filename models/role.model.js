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
    deleteAt: Date,
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema, 'roles');