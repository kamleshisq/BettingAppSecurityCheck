const mongoose = require('mongoose')

const resumeSuspend = mongoose.Schema({
    userName : {
        type:String,
        requied:true
    },
    marketId : {
        type:String,
        requied:true
    },
    status:{
        type:Boolean,
        default:true
    },
    whiteLabel : {
        type:String
    }
})


const resumeSuspendModel = mongoose.model('resumeSuspendModel', resumeSuspend )

module.exports = resumeSuspendModel