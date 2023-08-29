const mongoose = require("mongoose");

const commissionRepport = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    market:{
        type:String,
        required:true
    },
    commType:{
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

const commissionRepportModel = mongoose.model("commissionRepportModel",commissionRepport )

module.exports = commissionRepportModel