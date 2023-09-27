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
        type:String
    },
    betArray:[{
        Id:String
    }]
});


const InprogreshModel = mongoose.model('InprogreshModel', InprogressSchema);

module.exports = InprogreshModel