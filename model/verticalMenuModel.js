const mongoose = require("mongoose");

const vertixalMenu = mongoose.Schema({
    menuName:{
        type:String,
        required:true,
        unique:true
    },
    url:{
        type:String,
        required:true
    },
    num:{
        type:Number,
        required:true
    },
    page:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

const verticalMenuModel = mongoose.model("verticalMenuModel", vertixalMenu)

module.exports = verticalMenuModel