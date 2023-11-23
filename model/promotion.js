const { boolean } = require('joi');
const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
    position:{
        type:String,
        required:true
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
    },
    link:{
        type:String,
        required:true
    },
    whiteLabelName:{
        type:String,
        required:true
    }
});

const promotion = mongoose.model('promotion', promotionSchema);

module.exports = promotion;