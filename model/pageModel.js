const mongoose = require("mongoose");


const pages = mongoose.Schema({
    Name:{
        type:String,
        required:true,
        unique:true
    }
})

const pagesModel = mongoose.model('pagesModel', pages)

module.exports = pagesModel