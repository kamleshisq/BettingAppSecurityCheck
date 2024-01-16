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
    },
    parentArray:[
        {
            parentUSerId:String,
            uplineShare:Number
        }
    ],
    parentId:{
        type:String
    },
    exposure:{
        type:Number
    },
    commissionStatus:{
        type:Boolean,
        default:false
    },
    WinAmount : {
        type:Number
    },
    commionstatus:{
        type:Boolean,
        required:true,
        default:false
    }
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
betSchema.post(/^find/, function (docs) {
    // console.log(docs)
    // if(docs){
    if(docs != null){
        if(Array.isArray(docs)){
            for(const i in docs){
                // console.log(docs[i], "MODEL")
                docs[i].returns = roundToTwoDecimals(docs[i].returns);
               
                // console.log(docs[i].myPL, "MODEL")
            }
        }else{
            docs.returns = roundToTwoDecimals(docs.returns);
            
        }
    }
    // }
});
// betSchema.pre(/^find/, function(next){
//     this.populate({
//         path:'users',
//         select:'whitelabel'
//     })
//     next()
// })

const betModel = mongoose.model("betModel", betSchema);

module.exports = betModel