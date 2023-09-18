const mongoose = require('mongoose');


const betLimitMatchWise = mongoose.Schema({
    matchTitle:{
        type:String
    },
    marketDetails:[{
        title:String,
        value:[{
            title:String,
            value:Number
        }]
    }],
})


const betLimitMatchWisemodel = mongoose.model('betLimitMatchWisemodel', betLimitMatchWise);

module.exports = betLimitMatchWisemodel