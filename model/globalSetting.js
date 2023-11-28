const mongoose = require('mongoose');

const globalSettingsSchema = mongoose.Schema({
    logo1:{
        type:String,
        required:true
    },
    logo1:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    whiteLabel:{
        type:String,
        required:true
    },
})

const globalSettingModel = mongoose.model('globalSettingModel', globalSettingsSchema)

module.exports = globalSettingModel