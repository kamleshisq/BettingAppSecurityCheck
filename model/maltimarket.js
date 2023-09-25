const mongoose = require("mongoose");


const multimarket = mongoose.Schema({
    userId :{
        type:String,
        required:true,
        unique:true
    },
    marketIds:[
        {
            type:String
        }
    ]
})

const multimarketModel = mongoose.model("multimarketModel", multimarket)

module.exports = multimarketModel