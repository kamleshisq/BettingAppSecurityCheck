const mongoose = require('mongoose');

const commissionNew = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    eventId:{
        type:String,
        required:true
    },
    sportId:{
        type:String,
        required:true
    },
    seriesName:{
        type:String,
        required:true
    },
    marketId:{
        type:String,
        required:true
    },
    eventDate:{
        type:Date,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    commission:{
        type:Number,
        required:true
    },
    upline:{
        type:Number,
        // required:true
    },
    commissionType:{
        type:String,
        required:true
    },
    commissionStatus:{
        type:String,
        required:true,
        default:'Unclaimed'
    },
    commissionPercentage:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    marketName:{
        type:String,
        // required:true
    },
    claimeDate:{
        type:Date
    },
    loginUserId:{
        type:String,
        required:true
    },
    parentIdArray:{
        type:[String]
    },
    betId:String,
    uniqueId:String,
    settleStatus:{
        type:Boolean,
        default:false
    },
    parrentArrayThatClaid:{
        type: [{
            type: String
        }],
        default: []
    },
    setleCOMMISSIONMY:{
        type:Boolean,
        default:true
    }
})

commissionNew.pre('find', function (next) {
    this.where({ commissionStatus: { $ne: 'cancel' } });
    next();
});

commissionNew.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { commissionStatus: { $ne: 'cancel' } } });
    next();
});


const commissionNewModel = mongoose.model('commissionNewModel', commissionNew)


module.exports = commissionNewModel


