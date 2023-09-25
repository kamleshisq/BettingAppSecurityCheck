const mongoose = require('mongoose');


const whiteLabelSchema = mongoose.Schema({
    whiteLabelName:{
        required:true,
        type:String
    }
})


const whiteLabel = mongoose.model('whiteLabel', whiteLabelSchema);

module.exports = whiteLabel