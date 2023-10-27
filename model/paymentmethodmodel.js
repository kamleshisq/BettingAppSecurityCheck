const mongoose = require("mongoose");


const paymentMethodSchem = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    accountholdername:{
        type:String,
        required:true
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
    ifsccode:{
        type:String
    },
    bankname:{
        type:String,
    },
    branchname:{
        type:String
    },
    displayname:{
        type:String,
        required:true
    },
    pmethod:{
        type:String,
        required:true,
        enum:['banktransfer','upi','paytm']
    },
    status:{
        type:Boolean,
        required:true
    }
})

const payment = mongoose.model('paymentmethodmodel', paymentMethodSchem)

module.exports = payment