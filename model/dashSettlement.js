const mongoose = require('mongoose')

const dashSettlementSchema = mongoose.Schema({
    sportName:{
        type:String,
        required:true
    },
    seriesName:{
        type:String,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    bet_count:{
        type:Number,
        required:true
    }
})

const settlement = mongoose.model('dashsettlement',dashSettlementSchema)

module.exports = settlement