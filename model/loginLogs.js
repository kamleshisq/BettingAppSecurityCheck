// const { string } = require("joi");
const mongoose = require("mongoose");

const loginLogSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    userName:{
        type:String
    },
    role_Type:{
        type:Number
    },
    login_time:{
        type:Date,
        default:Date.now(),
        required:true
    },
    logOut_time:{
        type:Date
    },
    isOnline:{
        type:Boolean
    },
    ip_address:{
        type:String,
        required:true
    },
    session_id:{
        type:String,
        required:true
    },
    device_info:{
        type:String,
        required:true
    },
    logs:[{
        type:String
    }]
});

loginLogSchema.pre(/^find/, function(next){
    this.populate({
        path:'user_id',
        select:'userName name _id -role'
    })
    next()
})

const loginLogs = mongoose.model('loginLogs', loginLogSchema);

module.exports = loginLogs;