const { string } = require('joi');
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
    transactionId:{
        type:String,
        required:true
    },
    gameId:{
        type:String,
        required:true       
    },
    roundId:{
        type:String,
        required:true
    },
    debitAmount:{
        type:Number,
        required:true
    },
    betType:{
        type:String,
        required:true
    },
    result:{
        type:String
    },
    WinAmmount:{
        type:Number
    }
})

const betModel = mongoose.model("betModel", betSchema);

module.exports = betModel