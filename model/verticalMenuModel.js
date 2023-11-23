const mongoose = require("mongoose");

const vertixalMenu = mongoose.Schema({
    menuName:{
        type:String,
        required:true
    },
    num:{
        type:Number,
        required:true
    },
    url:{
        type:String
    },
    page:{
        type:String
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

const verticalMenuModel = mongoose.model("verticalMenuModel", vertixalMenu)

module.exports = verticalMenuModel