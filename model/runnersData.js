const mongoose = require('mongoose');

const runnerSchema = mongoose.Schema({
    runners : {
        type:String,
        required:true
    },
    eventId:{
        type:String,
        required:true
    },
    marketId:{
        type:String,
        unique:true
    },
    sport:{
        type:String
    },
    marketTitle:{
        type:String
    }
})

const runnerDataModel = mongoose.model('runnerDataModel', runnerSchema);

module.exports = runnerDataModel