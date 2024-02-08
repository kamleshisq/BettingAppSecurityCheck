const { string } = require('joi');
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
    },
    type:{
        type:String
    },
    accStype:{
        type:String
    },
    marketId:{
        type:String
    },
    cancelMarketId:{
        type:String
    },
    gameId:{
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

function roundToTwoDecimals(value) {
    if (typeof value === 'number' && !isNaN(value)) {
        return parseFloat(value.toFixed(2));
    } else {
        // Handle cases where value is not a number or is undefined
        // You can return an error message or a default value here.
        return NaN; // or any other appropriate handling
    }
}

accountStatementByUser.post(/^find/, function (docs) {
    // console.log(docs)
    // if(docs){
    if(docs != null){
        if(Array.isArray(docs)){
            for(const i in docs){
                // console.log(docs[i], "MODEL")
                docs[i].balance = roundToTwoDecimals(docs[i].balance);
                docs[i].creditDebitamount = roundToTwoDecimals(docs[i].creditDebitamount);
              
            }
        }else{
            docs.balance = roundToTwoDecimals(docs.balance);
            docs.creditDebitamount = roundToTwoDecimals(docs.creditDebitamount);
           
        }
    }
    // }
});


const accountStatement = mongoose.model('accountStatement', accountStatementByUser);

module.exports = accountStatement;