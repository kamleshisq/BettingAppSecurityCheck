const mongoose = require('mongoose')

const dashTopBetsSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    marketName:{
        type:String,
        required:true
    },
    odds:{
        type:Number,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    risk:{
        type:Number,
        required:true
    }
})

const topBets = mongoose.model('dashtopbets',dashTopBetsSchema)

module.exports = topBets