const mongoose = require("mongoose");

const banner =  mongoose.Schema({
    bannerName:{
        type:String,
        unique:true,
        required:true
    },
    url:{
        type:String
    },
    banner:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    whiteLabelName:{
        type:String,
        required:true
    }
})

const bannerModel = mongoose.model("bannerModel", banner);

module.exports = bannerModel