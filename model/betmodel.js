const mongoose = require('mongoose');


const betSchema = mongoose.Schema({
    operatorId:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    userName:{
        type:String
    },
    transactionId:{
        type:String,
        required:true
    },
    gameId:{
        type:String       
    },
    roundId:{
        type:String
    },
    betType:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    event:{
        type:String,
    },
    BetOn:{
        type:String
    },
    oddValue:{
        type:Number
    },
    Stake:{
        type:Number
    },
    status:{
        type:String
    },
    returns:{
        type:Number
    }
})

const betModel = mongoose.model("betModel", betSchema);

module.exports = betModel