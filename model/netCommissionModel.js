const mongoose = require("mongoose");

const netCommission = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    market:{
        type:String,
        required:true
    },
    percentage:{
        type:Number,
        required:true
    }, 
    commPoints:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"Pending"
    },
    event:{
        type:String
    },
    match:{
        type:String
    },
    Sport:{
        type:String
    }
})


const netCommissionModel = mongoose.model("netCommission", netCommissionModel)
module.exports = netCommissionModel