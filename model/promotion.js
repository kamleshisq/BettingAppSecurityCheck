const { boolean } = require('joi');
const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
    position:{
        type:String,
        required:true,
        unique:true
    },
    Image:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    video:{
        type:Boolean,
        required:true
    },
    click:{
        type:Number,
        default:0
    }
});

const promotion = mongoose.model('promotion', promotionSchema);

module.exports = promotion;