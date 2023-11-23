const mongoose = require('mongoose');

const horizontalMenu = mongoose.Schema({
    menuName:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    page:{
        type:String
    },
    Number:{
        type:Number,
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
});


const horizontalMenuModel = mongoose.model("horizontalMenuModel", horizontalMenu)

module.exports = horizontalMenuModel