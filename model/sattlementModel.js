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
    userName:{
        type:String,
        required:true
    }
});


const StatementModel = mongoose.model("StatementModel", sattlement);


module.exports = StatementModel