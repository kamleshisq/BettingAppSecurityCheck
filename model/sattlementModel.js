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
    eventName:[{
        type:String
    }]
});


const StatementModel = mongoose.model("StatementModel", sattlement);


module.exports = StatementModel