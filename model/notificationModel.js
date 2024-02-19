const { boolean } = require("joi");
const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        default:Date.now()
    },
    endDate:{
        type:Date,
    },
    status:{
        type:Boolean,
        default:true
    },
    userId:{
        type:String,
        required:true
    }
})


const notificationModel = mongoose.model('notificationModel', notificationSchema)

module.exports = notificationModel;