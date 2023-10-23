const mongoose = require('mongoose')

const betLimitSchema = mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    min_stake:{
        type:Number,
        required:true
    },
    max_stake:{
        type:Number,
        required:true
    },
    max_profit:{
        type:Number,
        required:true
    },
    max_odd:{
        type:Number,
        required:true
    },
    delay:{
        type:Number,
        required:true
    },
    max_bet:{
        type:Number
    }
})

const Betlimit = mongoose.model('Betlimit',betLimitSchema);

module.exports = Betlimit;