const mongoose = require("mongoose");


const paymentreportSchem = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    accountholdername:{
        type:String,
        required:true
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
        required:true,
        unique:true
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
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    notes:{
        type:String
    },
    accountnumber:{
        type:String
        
    },
    upiid:{
        type:String
        
    },
    phonenumber:{
        type:String
    },
    remark:{
        type:String
    }
})

const paymentreport = mongoose.model('paymentreportmodel', paymentreportSchem)

module.exports = paymentreport