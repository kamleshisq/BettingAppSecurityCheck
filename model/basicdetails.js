const { string } = require('joi');
const mongoose = require('mongoose');

const besicSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Whitelabel:{
        type:String,
        required:true
    },
    data:{
        type:string,
        required:true
    }
})

const betsDetailsModel = mongoose.model('betsDetailsModel', besicSchema)
module.exports = betsDetailsModel