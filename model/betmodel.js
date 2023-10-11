const mongoose = require('mongoose');


const betSchema = mongoose.Schema({
    operatorId:{
        type:String,
    },
    token:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    userName:{
        type:String
    },
    transactionId:{
        type:String,
    },
    gameId:{
        type:String       
    },
    roundId:{
        type:String
    },
    betType:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    event:{
        type:String,
    },
    selectionName:{
        type:String
    },
    oddValue:{
        type:Number
    },
    Stake:{
        type:Number
    },
    status:{
        type:String
    },
    alertStatus:{
        type:String,
        enum:['ALERT,CANCEL,ACCEPT']
    },
    returns:{
        type:Number
    },
    role_type:{
        type:Number
    },
    match:{
        type:String
    },
    marketName:{
        type:String
    },
    marketId:{
        type:String
    },
    secId:{
        type : String
    },
    eventId:{
        type: String
    },
    eventDate:{
        type:Date
    },
    result:{
        type:String
    },
    remark:{
        type:String
    },
    calcelUser:{
        type:String
    },
    bettype2:{
        type:String
    },
    ip:{
        type:String
    }
})

// betSchema.pre(/^find/, function(next){
//     this.populate({
//         path:'users',
//         select:'whitelabel'
//     })
//     next()
// })

const betModel = mongoose.model("betModel", betSchema);

module.exports = betModel