const mongoose = require('mongoose');


const houseFund = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    Remark:{
        type:String,
    }
})

const houseFundModel = mongoose.model("houseFundModel", houseFund);

module.exports = houseFundModel