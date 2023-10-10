const mongoose = require('mongoose');

const timelyNotification = mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    userName:{
        type:String,
        required:true
    },
    marketId:{
        type:String,
        required:true
    }
})

const timelyNotificationModel = mongoose.model('timelyNotificationModel', timelyNotification)

module.exports = timelyNotificationModel