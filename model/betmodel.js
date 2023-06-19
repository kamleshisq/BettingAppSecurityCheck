const mongoose = require('mongoose');


const betSchema = mongoose.Schema({
    operatorId:{
        type:String,
    },
    token:{
        type:String,
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
    selectionName:{
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
    },
    role_type:{
        type:Number
    },
    match:{
        type:String
    },
    marketName:{
        type:String
    },
    marketId:{
        type:String
    },
    secId:{
        type : String
    }
})

const betModel = mongoose.model("betModel", betSchema);

module.exports = betModel