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
    }
})

const runnerDataModel = mongoose.model('runnerDataModel', runnerSchema);

module.exports = runnerDataModel