const mongoose = require('mongoose');


const colorCodeSchema = mongoose.Schema({
    color1_1:{
        type:String,
        required:true
    },
    color1_2:{
        type:String,
        required:true
    },
    color6_1:{
        type:String,
        required:true
    },
    color6_2:{
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
        required:true,
        unique:true
    }
})

const colorCodeModel = mongoose.model('colorCodeModel', colorCodeSchema);

module.exports = colorCodeModel