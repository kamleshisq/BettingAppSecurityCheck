const mongoose = require("mongoose");


const paymentMethodSchem = mongoose.Schema({
    accountholdername:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique
    },
    transactiontype:{
        type:String,
        required:true,
        unique
    },
    status:{
        type:String,
        required:true,
        enum:['pending','approved','denied']
    },
    amount:{
        type:Number,
        required:true
    },
    utr:{
        type:String,
        required:true
    },
    pmethod:{
        type:String,
        required:true,
        enum:['banktransfer','upi','paytm']
    },
    approvedamount:{
        type:Number
    }
})

const payment = mongoose.model('paymentmethodmodel', paymentMethodSchem)

module.exports = payment