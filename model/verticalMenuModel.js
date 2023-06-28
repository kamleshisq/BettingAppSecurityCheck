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
        required:true,
        unique:true
    },
    page:{
        type:Number,
        required:true
    }
})

const verticalMenuModel = mongoose.model("verticalMenuModel", vertixalMenu)

module.exports = verticalMenuModel