const mongoose = require('mongoose');

const slider = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    images:{
        type:mongoose.Schema.Types.Mixed,
        default:[]
    },
    mainUrl:{
        type:String,
        required:true
    }
});

const sliderModel = mongoose.model('sliderModel', slider);

module.exports = sliderModel