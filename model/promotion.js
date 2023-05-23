const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
    position:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    }
});

const promotion = mongoose.model('promotion', promotionSchema);

module.exports = promotion;