const mongoose = require('mongoose');


const houseFund = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    Remark:{
        type:String,
    },
    type:{
        type:String,
    },
    closingBalance:{
        type:Number,
        required:true
    }
})

const houseFundModel = mongoose.model("houseFundModel", houseFund);

module.exports = houseFundModel