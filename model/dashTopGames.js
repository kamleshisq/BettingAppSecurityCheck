const mongoose = require('mongoose');

const dashtopgamesSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user_count:{
        type:Number,
        required:true
    },
    bet_count:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

const dashTopGames = mongoose.model('dashtopgames',dashtopgamesSchema)

module.exports = dashTopGames;