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
    },
    logOut_time:{
        type:Date
    },
    isOnline:{
        type:Boolean
    },
    ip_address:{
        type:String,
    },
    session_id:{
        type:String,
    },
    device_info:{
        type:String,
    },
    logs:[{
        type:String
    }],
    gameToken:{
        type:String
    },
    sessionId:{
        type:String
    }
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