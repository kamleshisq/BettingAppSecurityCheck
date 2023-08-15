const mongoose = require("mongoose");

const settlementHistory = mongoose.Schema({
    marketID:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    result:{
        type:String,
        required:true
    }
});


const settlementHistoryModel = mongoose.model("settlementHistoryModel", settlementHistory)

module.exports = settlementHistoryModel