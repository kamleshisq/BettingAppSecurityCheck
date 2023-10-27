const mongoose = require("mongoose");


const paymentreportSchem = mongoose.Schema({
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
    },
    image:{
        type:String,
        required:ture
    },
    date:{
        type:Date,
        required:true
    }
})

const paymentreport = mongoose.model('paymentmethodmodel', paymentreportSchem)

module.exports = paymentreport