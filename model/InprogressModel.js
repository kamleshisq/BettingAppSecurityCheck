const mongoose = require('mongoose');


const InprogressSchema = mongoose.Schema({
    eventId:{
        type:String,
        required:true
    },
    marketId:{
        type:String,
        required:true
    },
    length:{
        type:Number
    },
    marketName:{
        type:String
    },
    settledBet:{
        type:Number,
        default:0
    },
    progressType:{
        type:String,
        required:true
    },
    betArray:[{
        Id:String
    }]
});


const InprogreshModel = mongoose.model('InprogreshModel', InprogressSchema);

module.exports = InprogreshModel