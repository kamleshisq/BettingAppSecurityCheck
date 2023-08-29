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
<<<<<<< HEAD
=======
        },
        status:{
            type:Boolean,
            default:false
>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd
        }
    },
    Bookmaker:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
<<<<<<< HEAD
            default:"WIN"
=======
            default:"ENTRY"
        },
        status:{
            type:Boolean,
            default:false
>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd
        }
    },
    fency:{
        percentage:{
            type:Number,
            default:0
        },
        type:{
            type:String,
<<<<<<< HEAD
            default:"WIN"
=======
            default:"ENTRY"
        },
        status:{
            type:Boolean,
            default:false
>>>>>>> 4dfe15377a0e35d954e7af35a413aa490c6221bd
        }
    }
})


let commissionModel = mongoose.model("commissionModel", commission);


module.exports = commissionModel