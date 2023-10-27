const mongoose = require("mongoose");


const paymentMethodSchem = mongoose.Schema({
    accountholdername:{
        type:String,
        required:true,
        unique:true
    },
    accountnumber:{
        type:String,
        unique
    },
    upiid:{
        type:String,
        unique
    },
    phonenumber:{
        type:String,
        unique
    },
    ifsccode:{
        type:String,
        required:true,
        unique
    },
    bankname:{
        type:String,
        required:true
    },
    branchname:{
        type:String,
        required:true
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
        type:String,
        required:true
    }
})

const payment = mongoose.model('paymentmethodmodel', paymentMethodSchem)

module.exports = payment