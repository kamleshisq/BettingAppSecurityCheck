const mongoose = require('mongoose');


const paymentMethodUSerSiedeSchema = mongoose.Schema({
        userName:{
            type:String,
            required:true
        },
        accountholdername:{
            type:String,
            required:true
        },
        accountnumber:{
            type:String,
            unique:true,
            sparse: true
        },
        upiid:{
            type:String,
            unique:true,
            sparse: true
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
            enum:['banktransferW','upiW','paytmW']
        },
        status:{
            type:Boolean,
            required:true,
            default:true
        }
})

const paymentUserSide = mongoose.model('paymentmethodusersidemodel', paymentMethodUSerSiedeSchema)

module.exports = paymentUserSide