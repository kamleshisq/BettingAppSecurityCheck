const mongoose = require("mongoose")


const commissionMarket = mongoose.Schema({
    marketId:{
        type:String,
        required:true,
        unique:true
    }
})

const commissionMarketModel = mongoose.model("commissionMarketModel", commissionMarket);


module.exports = commissionMarketModel