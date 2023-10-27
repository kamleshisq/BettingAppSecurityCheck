const mongoose = require("mongoose");


const paymentMethodSchem = mongoose.Schema({
    accountholdername:{
        type:String,
        required:true,
        unique:true
    },
    accountnumber:{
        type:String,
        unique:true
    },
    upiid:{
        type:String,
        unique:true
    },
    phonenumber:{
        type:String,
        unique:true
    },
    ifsccode:{
        type:String,
        required:true,
        unique:true
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
        type:Boolean,
        required:true
    }
})

const payment = mongoose.model('paymentmethodmodel', paymentMethodSchem)

module.exports = payment