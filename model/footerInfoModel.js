const mongoose = require('mongoose')


const footerInfo = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    link : {
        type:String,
    },
    whiteLabelName:{
        type:String,
        required:true
    }
})

const footerInfoModel = mongoose.model('footerInfoModel', footerInfo)

module.exports = footerInfoModel