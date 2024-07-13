const mongoose = require('mongoose');

const settingGeneralSchema = new mongoose.Schema({
    websiteName: String, 
    companyName: String,
    hotline: String,
    phoneNumber: String,
    email: String,
    address: String,
    map: String,
    copyright: String,
    favicon: String,
    logo: String,
    socialLink: [
        {
            name: String,
            domain: String,
            path: String
        }
    ],
    eCommerceLink:[
        {
            name: String,
            domain: String,
            path: String
        }
    ],
    branch: [
        {
            branchName: String,
            phoneNumber: String,
            email: String,
            address: String
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('SettingGeneral', settingGeneralSchema, 'setting-general');