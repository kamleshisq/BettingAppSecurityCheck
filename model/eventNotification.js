const mongoose = require('mongoose');

const eventNotification = mongoose.Schema({
    status:{
        type:Boolean,
        default:true
    },
    message:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    }
})

const eventNotificationModel = mongoose.model('eventNotificationModel', eventNotification)

module.exports = eventNotificationModel