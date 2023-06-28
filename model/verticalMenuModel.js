const mongoose = require("mongoose");

const vertixalMenu = mongoose.Schema({
    menuName:{
        type:String,
        required:true
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
        type:Number,
        required:true
    }
})

const verticalMenuModel = mongoose.model("vertixalMenuModel", vertixalMenu)

module.exports = verticalMenuModel