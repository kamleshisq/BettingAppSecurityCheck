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
        }
    },
    Bookmaker:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
            default:"WIN"
        }
    },
    fency:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
            default:"WIN"
        }
    }
})


let commissionModel = mongoose.model("commissionModel", commission);


module.exports = commissionModel