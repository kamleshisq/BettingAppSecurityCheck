const mongoose = require('mongoose');
// const validator = require('validator');
const bycrypt = require('bcrypt');
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
        default:0
    },
    uplinePL:{
        type:Number,
        default:0
    },
    clientPL:{
        type:Number,
        default:0
    },
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
        type:Number
    },
    Won:{
        type:Number
    },
    Loss:{
        type:Number
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

// userSchema.pre(/^find/, async function(next){
//     this.find({isActive:true})
// })

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bycrypt.compare(candidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema);

module.exports = User