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
        },
        limit:{
            type:Number
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
        },
        limit:{
            type:Number
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
        },
        limit:{
            type:Number
        }
    }
})


let commissionModel = mongoose.model("commissionModel", commission);


module.exports = commissionModel