const mongoose = require('mongoose');

const withdowReqSchema = mongoose.Schema({
    sdmUserName : {
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    payMentMethodId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    note:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    sdmRemark:{
        type:String
    }
})


const withdowReqModel = mongoose.model('withdowReqModel', withdowReqSchema);

module.exports = withdowReqModel