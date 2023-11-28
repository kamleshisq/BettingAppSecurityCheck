const mongoose = require('mongoose');

const globalSettingsSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    whiteLabel:{
        type:String,
        required:true
    },
    data:{
        type:String,
        required:true
    }
})

const globalSettingModel = mongoose.model('globalSettingModel', globalSettingsSchema)

module.exports = globalSettingModel