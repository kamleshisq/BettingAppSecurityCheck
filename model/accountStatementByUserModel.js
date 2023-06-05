const mongoose = require('mongoose');

const accountStatementByUser = mongoose.Schema({
    child_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        // required:true
    },
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    parent_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        // required:true
    },
    description:{
        type:String,
        required:true
    },
    creditDebitamount:{
        type:Number,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    date:{
        type:Date,    
        required:true
    },    
    userName:{
        type:String
    },
    role_type:{
        type:Number
    },
    Remark:{
        type:String
    },
    transactionId:{
        type:String
    },
    stake:{
        type:String
    }
})

accountStatementByUser.pre(/^find/, function(next){
    this.populate({
        path:'child_id',
        select:'userName name'
    }).populate({
        path:"user_id",
        select:'userName name'  
    }).populate({
        path:"parent_id",
        select:'userName name'
    })
    next()
})


const accountStatement = mongoose.model('accountStatement', accountStatementByUser);

module.exports = accountStatement;