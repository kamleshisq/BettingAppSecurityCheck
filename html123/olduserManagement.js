const mongoose = require('mongoose');
// const validator = require('validator');
const bycrypt = require('bcrypt');
function roundToTwoDecimals(value) {
    return parseFloat(value).toFixed(2);
}
// const { default: isEmail } = require('validator/lib/isEmail');
// const { string } = require('joi');

const userSchema = mongoose.Schema({
    userName:{
        type: String,
        unique:true,
        required: [true, "please provide your name"],
    },
    name:{
        type:String,
        required:true
    },
    roleName:{
        type:String,
        required:true
    },
    whiteLabel:{
        type:String
    },
    creditReference:{
        type:Number,
        default:0
    },
    balance:{
        type:Number,
        default:0
    },
    availableBalance:{
        type:Number,
        default:0
    },
    downlineBalance:{
        type:Number,
        default:0
    },
    myPL:{
        type:Number,
        default:0,
        set: function(value) {
             return parseFloat(value).toFixed(2);
        }
    },
    uplinePL:{
        type:Number,
        default:0,
        set: function(value) {
             return parseFloat(value).toFixed(2);
        }
    },
    lifetimePL:{
        type:Number,
        default:0,
        set: function(value) {
             return parseFloat(value).toFixed(2);
        }
    },
    pointsWL:{
        type:Number,
        default:0
    },
    // clientPL:{
    //     type:Number,
    //     default:0
    // },
    exposure:{
        type:Number,
        default:0
    },
    exposureLimit:{
        type:Number,
        default:0
    },
    lifeTimeCredit:{
        type:Number,
        default:0
    },
    lifeTimeDeposit:{
        type:Number,
        default:0  
    },
    parent_id:{
        type:String,
        required:true,
        default:"1"
    },
    role:{
        type:mongoose.Schema.ObjectId,
        ref:'Role'
    },
    role_type:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:[true, "please provide a password"],
        minlength:[8, "Please inter at-least 8 char."],
        select: false
    },
    passwordConfirm:{
        type:String,
        minlength:[8, "Please inter at-least 8 char."],
        required:[true, "please provide a password Confirm"],
        validate:{
            validator: function(el){
                return el == this.password
            },
            message: "password are not same"
        }
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    },
    is_Online:{
        type:Boolean,
        required:true,
        default:false
    },
    betLock:{
        type:Boolean,
        required:true,
        default:false
    },
    parentUsers:[{
        type:String
    }],
    gameCount:[{
        type:String
    }],
    Bets:{
        type:Number,
        default:0
    },
    Won:{
        type:Number,
        default:0
    },
    Loss:{
        type:Number,
        default:0
    },
    kycDocName:{
        type:String,
        default:null
    },
    kycDoc:{
        type:String,
        default:null
    },
    kycDocNum:{
        type:String,
        default:null
    },
    kycNotification:{
        type:Boolean,
        default:false
    },
    isKycVer:{
        type:Boolean,
        default:false
    },
    contact:{
        type:Number
    },
    email:{
        type:String
    },
    note:{
        type:String
    },
    myShare:{
        type:Number,
        default:100
    },
    Share:{
        type:Number,
        default:0
    },
    transferLock:{
        type:Boolean,
        default:false
    },
    maxCreditReference:{
        type:Number,
        default:100000
    },
    commission:{
        type:Number,
        default:0
    },
    netCommisssion:{
        type:Number,
        default:0
    }
})

userSchema.pre('save', async function(next){
    // console.log(this.password, "asdfghjtyui")
    this.password = await bycrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
})

userSchema.pre(/^find/, function(next){
    this.populate({
        path:'role',
        select:'roleName authorization role_type role_level userAuthorization'
    })
    next()
})

// userSchema.pre('save', function (next) {
//     this.myPL = roundToTwoDecimals(this.myPL);
//     this.uplinePL = roundToTwoDecimals(this.uplinePL);
//     this.lifetimePL = roundToTwoDecimals(this.lifetimePL);
//     next();
// });

// function roundToTwoDecimals(value) {
//     console.log("WORKINGSCHEMAAAA")
//     return parseFloat(value).toFixed(2);
// }

userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('roundedDownlineBalance').get(function () {
    return this.downlineBalance.toFixed(2);
}).set(function (value) {
    this.downlineBalance = roundToTwoDecimals(value);
});

userSchema.virtual('roundedMyPL').get(function () {
    return this.myPL.toFixed(2);
}).set(function (value) {
    this.myPL = roundToTwoDecimals(value);
});

userSchema.virtual('roundedUplinePL').get(function () {
    return this.uplinePL.toFixed(2);
}).set(function (value) {
    this.uplinePL = roundToTwoDecimals(value);
});

userSchema.virtual('roundedLifetimePL').get(function () {
    return this.lifetimePL.toFixed(2);
}).set(function (value) {
    this.lifetimePL = roundToTwoDecimals(value);
});

userSchema.virtual('roundedPointsWL').get(function () {
    return this.pointsWL.toFixed(2);
}).set(function (value) {
    this.pointsWL = roundToTwoDecimals(value);
});
// userSchema.pre(/^find/, async function(next){
//     this.find({isActive:true})
// })

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bycrypt.compare(candidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema);

module.exports = User