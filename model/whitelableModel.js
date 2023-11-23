const mongoose = require('mongoose');


const whiteLabelSchema = mongoose.Schema({
    whiteLabelName:{
        required:true,
        type:String
    },
    B2C_Status:{
        type:Boolean,
        default:false
    }
})


const whiteLabel = mongoose.model('whiteLabel', whiteLabelSchema);

module.exports = whiteLabel