const mongoose = require('mongoose');


const betLimitMatchWise = mongoose.Schema({
    matchTitle:{
        type:String
    },
    matchOdd:[{
        title:String,
        value:Number
    }],
    bookMaker:[{
        title:String,
        value:Number
    }],
    fency:[{
        title:String,
        value:Number
    }]
})


const betLimitMatchWisemodel = mongoose.model('betLimitMatchWisemodel', betLimitMatchWise);

module.exports = betLimitMatchWisemodel