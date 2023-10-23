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
    }
})


const resumeSuspendModel = mongoose.model('resumeSuspendModel', resumeSuspend )

module.exports = resumeSuspendModel