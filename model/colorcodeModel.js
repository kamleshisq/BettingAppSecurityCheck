const mongoose = require('mongoose');


const colorCodeSchema = mongoose.Schema({
    color1:{
        type:String,
        required:true
    },
    color6:{
        type:String,
        required:true
    },
    color11:{
        type:String,
        required:true
    },
    color2:{
        type:String,
        required:true
    },
    color7:{
        type:String,
        required:true
    },
    color14:{
        type:String,
        required:true
    },
    color15:{
        type:String,
        required:true
    },
    color13:{
        type:String,
        required:true
    },
    whitelabel:{
        type:String,
        required:true
    }
})

const colorCodeModel = mongoose.model('colorCodeModel', colorCodeSchema);

module.exports = colorCodeModel