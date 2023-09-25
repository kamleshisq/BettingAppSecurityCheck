const mongoose = require("mongoose");


const commission = mongoose.Schema({
    userId:{
        type:String,
        required : true
    },
    matchOdd:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
            default:"WIN"
        },
        status:{
            type:Boolean,
            default:false
        }
    },
    Bookmaker:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
            default:"ENTRY"
        },
        status:{
            type:Boolean,
            default:false
        }
    },
    fency:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
            default:"ENTRY"
        },
        status:{
            type:Boolean,
            default:false
        }
    }
})


let commissionModel = mongoose.model("commissionModel", commission);


module.exports = commissionModel