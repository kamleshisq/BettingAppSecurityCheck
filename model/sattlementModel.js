const mongoose = require("mongoose")

const sattlement = mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    },
    
})