const mongoose = require('mongoose')

const dashtopplayerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    bet_count:{
        type:Number,
        required:true
    },
    point:{
        type:Number,
        required:true
    }
})

const dashTopPlayer = mongoose.model('dashtopplayer',dashtopplayerSchema)

module.exports = dashTopPlayer;

