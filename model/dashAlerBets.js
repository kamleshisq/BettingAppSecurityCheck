const mongoose = require('mongoose')

const dashAlerBetsSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    point:{
        type:Number,
        required:true
    }
})

const alertBets = mongoose.model('dashalerbets',dashAlerBetsSchema)

module.exports = alertBets