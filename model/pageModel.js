const mongoose = require("mongoose");


const pages = mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    heading:{
        type:String,
        required:true
    },
    whiteLabelName:{
        type:String,
        required:true
    }
})

const pagesModel = mongoose.model('pagesModel', pages)

module.exports = pagesModel